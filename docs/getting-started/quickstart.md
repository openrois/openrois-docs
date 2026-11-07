---
sidebar_label: Quick Start
sidebar_position: 1
description: Run a gateway with simulated components and inspect it from your browser in a few minutes.
---

# Quick Start

This quick start runs a gateway with simulated components behind it, and connects the
OpenRoIS HRI Client, a browser-based inspector, to it. No robot is required.

You will need [Docker](https://docs.docker.com/get-started/get-docker/) with Compose,
[Node.js](https://nodejs.org/) 22.12 or later, and Git.

## 1. Get the Source

```bash
git clone https://github.com/openrois/openrois.git
cd openrois
```

## 2. Start a Gateway

The gateway listens on `ws://127.0.0.1:8765`, with the mock adapter behind it. The mock
adapter is an engine of its own that serves simulated components: Navigation,
PersonDetection, SystemInformation, and a test fixture.

```bash
docker compose up --build
```

## 3. Open the Inspector

In a second terminal, build the types and the JavaScript SDK, which the HRI Client uses from
the repository, then start it:

```bash
(cd interfaces/typescript && npm install && npm run build)
(cd sdk/javascript && npm install && npm run build)
cd examples/hri-client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **Connect**. The client calls
`rois.system.get_profile`, then renders one panel per component with its queries,
commands, and events.

<figure className="openrois-figure">
  <img src="/img/hri-client.png" alt="The OpenRoIS HRI Client connected to an engine, showing PersonDetection, Navigation, and SystemInformation components with their queries, commands, and events." />
  <figcaption>The HRI Client knows nothing about these components in advance. Everything on screen comes from the engine profile.</figcaption>
</figure>

Try binding the Navigation component, running a `component_status` query, or
subscribing to `reached_target`. Every action is a JSON-RPC 2.0 call that you can watch
in the browser's network inspector.

## What Just Happened

- The gateway published an **HRI Engine profile** describing the components of every engine
  behind it.
- The client discovered the components at runtime instead of hardcoding them. This is
  what lets one RoIS application work with any robot behind the gateway.
- Commands followed the RoIS reservation lifecycle: `bind`, then `execute`, then
  `release`.

## Next Steps

- Read how the pieces fit together in the [architecture](../concepts/architecture.md).
- Write your own [service application](../guides/service-application.md) with the
  JavaScript, Python or Unity SDK.
- Connect a real platform by writing a [component and adapter](../guides/components-and-adapters.md).
