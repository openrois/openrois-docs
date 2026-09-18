# Regenerates static/video/hri-client-demo.{mp4,webm} and the poster from a live
# quickstart setup (mock engine on ws://127.0.0.1:8765, hri-client dev server).
#
# Requirements: Google Chrome, ffmpeg, and Python with the websockets package.
# Usage: python scripts/record-demo.py http://localhost:5173/ /tmp/demo
#        then copy the outputs into static/video/.

"""Record a scripted demo of the hri-client in headless Chrome over CDP.

Captures fixed-rate screenshots while a scenario drives the page with real
mouse events and an injected cursor overlay, then encodes with ffmpeg.

Usage: record.py URL OUTDIR
"""
import asyncio, base64, json, os, shutil, subprocess, sys, tempfile, time, urllib.request

import websockets

URL, OUT = sys.argv[1], sys.argv[2]
W, H, SCALE, FPS = 1440, 920, 2, 12
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 9334

CURSOR_JS = r"""
(() => {
  const st = document.createElement('style');
  st.textContent = `
    .app{max-width:1400px}
    #demo-cursor{position:fixed;left:0;top:0;width:28px;height:28px;z-index:99999;
      pointer-events:none;transform:translate(-4px,-2px);
      transition:left .55s cubic-bezier(.22,.61,.36,1),top .55s cubic-bezier(.22,.61,.36,1);
      filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))}
    #demo-cursor.press{transform:translate(-4px,-2px) scale(.85)}
    #demo-ripple{position:fixed;width:44px;height:44px;border-radius:50%;z-index:99998;
      pointer-events:none;border:2px solid #5b8def;opacity:0;transform:translate(-50%,-50%) scale(.3)}
    #demo-ripple.go{animation:demoRipple .5s ease-out}
    @keyframes demoRipple{0%{opacity:.9;transform:translate(-50%,-50%) scale(.3)}
      100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)}}
  `;
  document.head.appendChild(st);
  const c = document.createElement('div');
  c.id = 'demo-cursor';
  c.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 3l14 8.5-6.2 1.6L9.5 20z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(c);
  const r = document.createElement('div');
  r.id = 'demo-ripple';
  document.body.appendChild(r);
  c.style.left = '720px'; c.style.top = '520px';
  window.__demo = {
    move(x, y) { c.style.left = x + 'px'; c.style.top = y + 'px'; },
    press() { c.classList.add('press'); },
    release(x, y) {
      c.classList.remove('press');
      r.style.left = x + 'px'; r.style.top = y + 'px';
      r.classList.remove('go'); void r.offsetWidth; r.classList.add('go');
    },
    rect(sel, text) {
      const els = [...document.querySelectorAll(sel)];
      const el = text ? els.find(e => e.textContent.trim().startsWith(text)) : els[0];
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {x: b.left + b.width / 2, y: b.top + b.height / 2};
    },
  };
  return 'ready';
})()
"""


class CDP:
    def __init__(self, ws):
        self.ws, self.n, self.pending = ws, 0, {}

    async def reader(self):
        async for raw in self.ws:
            msg = json.loads(raw)
            fut = self.pending.pop(msg.get("id"), None)
            if fut and not fut.done():
                fut.set_result(msg.get("result", msg))

    async def send(self, method, params=None):
        self.n += 1
        fut = asyncio.get_event_loop().create_future()
        self.pending[self.n] = fut
        await self.ws.send(json.dumps({"id": self.n, "method": method, "params": params or {}}))
        return await fut

    async def js(self, expr):
        res = await self.send("Runtime.evaluate", {"expression": expr, "awaitPromise": True, "returnByValue": True})
        return res.get("result", {}).get("value")


async def capture_loop(cdp, frames_dir, stop):
    i = 0
    interval = 1 / FPS
    next_t = time.monotonic()
    while not stop.is_set():
        shot = await cdp.send("Page.captureScreenshot", {"format": "jpeg", "quality": 88})
        with open(os.path.join(frames_dir, f"f{i:05d}.jpg"), "wb") as f:
            f.write(base64.b64decode(shot["data"]))
        i += 1
        next_t += interval
        delay = next_t - time.monotonic()
        if delay > 0:
            await asyncio.sleep(delay)
        else:
            next_t = time.monotonic()
    return i


async def click(cdp, sel, text=None, settle=1.2):
    pos = await cdp.js(f"window.__demo.rect({json.dumps(sel)}, {json.dumps(text)})")
    if not pos:
        raise RuntimeError(f"no element for {sel} {text}")
    x, y = pos["x"], pos["y"]
    await cdp.js(f"window.__demo.move({x},{y})")
    await asyncio.sleep(0.65)
    await cdp.send("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": x, "y": y})
    await cdp.js("window.__demo.press()")
    await cdp.send("Input.dispatchMouseEvent", {"type": "mousePressed", "x": x, "y": y, "button": "left", "clickCount": 1})
    await asyncio.sleep(0.09)
    await cdp.send("Input.dispatchMouseEvent", {"type": "mouseReleased", "x": x, "y": y, "button": "left", "clickCount": 1})
    await cdp.js(f"window.__demo.release({x},{y})")
    await asyncio.sleep(settle)


async def scenario(cdp):
    await asyncio.sleep(1.0)
    await click(cdp, ".btn-connect", settle=1.6)
    await click(cdp, ".btn-action.query", "robot_position", settle=1.4)
    await click(cdp, ".btn-action.query", "engine_status", settle=1.4)
    await click(cdp, ".btn-action.bind", None, settle=1.2)          # first Bind button: PersonDetection
    await click(cdp, ".btn-action.event", "person_detected", settle=0.8)
    # The mock engine sends a person_detected notification every 5 seconds.
    await asyncio.sleep(5.2)
    await click(cdp, ".btn-action.bind", None, settle=1.0)          # remaining Bind button: Navigation
    await click(cdp, ".btn-action.query", "get_parameter", settle=1.2)
    await click(cdp, ".btn-action.command", "execute", settle=2.2)
    await asyncio.sleep(1.0)


async def main():
    frames = os.path.join(OUT, "frames")
    shutil.rmtree(frames, ignore_errors=True)
    os.makedirs(frames)
    profile = tempfile.mkdtemp()
    proc = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                             f"--remote-debugging-port={PORT}", f"--user-data-dir={profile}",
                             f"--window-size={W},{H}", "--force-device-scale-factor=2", "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try:
                targets = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json"))
                page = next(t for t in targets if t["type"] == "page")
                break
            except Exception:
                time.sleep(0.2)
        async with websockets.connect(page["webSocketDebuggerUrl"], max_size=80_000_000) as ws:
            cdp = CDP(ws)
            reader = asyncio.create_task(cdp.reader())
            await cdp.send("Emulation.setDeviceMetricsOverride",
                           {"width": W, "height": H, "deviceScaleFactor": SCALE, "mobile": False})
            await cdp.send("Page.enable")
            await cdp.send("Page.navigate", {"url": URL})
            await asyncio.sleep(2.5)
            print("inject:", await cdp.js(CURSOR_JS))
            stop = asyncio.Event()
            cap = asyncio.create_task(capture_loop(cdp, frames, stop))
            await scenario(cdp)
            stop.set()
            n = await cap
            print("frames:", n)
            reader.cancel()
    finally:
        proc.terminate()

    base = os.path.join(OUT, "hri-client-demo")
    common = ["ffmpeg", "-y", "-framerate", str(FPS), "-i", os.path.join(frames, "f%05d.jpg")]
    vf = "scale=1920:-2:flags=lanczos,format=yuv420p"
    subprocess.run(common + ["-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "22",
                             "-movflags", "+faststart", "-an", base + ".mp4"], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(common + ["-vf", vf, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34", "-row-mt", "1",
                             "-an", base + ".webm"], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-i", os.path.join(frames, "f00000.jpg"), "-vf", "scale=1920:-2:flags=lanczos",
                    base + "-poster.jpg"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for ext in (".mp4", ".webm", "-poster.jpg"):
        print(ext, os.path.getsize(base + ext) // 1024, "KB")


asyncio.run(main())
