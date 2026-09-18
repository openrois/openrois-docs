---
sidebar_label: Benchmarks
sidebar_position: 4
description: Control-plane latency of OpenRoIS, measured over WebSockets through the gateway and directly against an adapter.
---

# Benchmarks

The control plane carries symbolic messages, so its cost is the JSON-RPC round trip and
the gateway hop, not payload size. `core/benchmarks/latency.py` measures that overhead
over real WebSockets on one machine: an application calls an adapter first **through a
gateway** (two hops) and then **directly** against the adapter's own WebSocket server (one
hop). The benchmark component answers immediately, so a real robot adds its own backend
time on top of these numbers.

## Results

Apple M1 Max, 64 GB, macOS 26.6, Python 3.14, `websockets` 17.1, loopback interface,
1000 iterations per measurement after 50 warm-up calls. Milliseconds.

| Path | Operation | p50 | p95 | p99 | max |
|------|-----------|----:|----:|----:|----:|
| Through the gateway | `query` | 0.260 | 0.334 | 0.405 | 0.584 |
| Through the gateway | `execute` | 0.274 | 0.370 | 0.497 | 0.674 |
| Through the gateway | event delivery | 0.131 | 0.164 | 0.207 | 0.327 |
| Direct to the adapter | `query` | 0.116 | 0.153 | 0.233 | 0.496 |
| Direct to the adapter | `execute` | 0.119 | 0.155 | 0.195 | 0.298 |
| Direct to the adapter | event delivery | 0.066 | 0.085 | 0.100 | 0.223 |

A request through the gateway costs about 0.14 ms more than a direct call at the median,
which is the price of the second hop: parsing, routing through the child engine proxy, and
re-serializing. Event delivery is measured from the component's `emit` to the
application's receipt and includes the same hop.

Over a network, add the round-trip time of each hop. The gateway hop is the one that
crosses the internet in the remote-operation topology; the adapter hop stays on the
robot's local network.

## Reproduce

```bash
pip install -e "interfaces/python" -e components/core -e "core[dev]"
cd core && python benchmarks/latency.py --iterations 1000
```

`--json` prints the report as JSON. The script needs no robot and no network beyond
loopback.
