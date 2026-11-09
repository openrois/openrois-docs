---
sidebar_label: Quick Start
sidebar_position: 1
description: Run a gateway with simulated components and explore it in your browser with one command.
---

# Quick Start

This quick start runs a gateway with simulated components behind it, and the OpenRoIS
Inspector, a browser app that connects to the gateway as a service application does. No
robot is required, and nothing needs to be installed besides
[Docker](https://docs.docker.com/get-started/get-docker/) with Compose and Git.

## 1. Get the Source

```bash
git clone https://github.com/openrois/openrois.git
cd openrois
```

## 2. Start the Stack

```bash
docker compose up --build
```

This builds and starts three containers:

- the **gateway**, the main HRI Engine, listening on `ws://localhost:8765`;
- the **mock adapter**, an engine of its own below the gateway that serves simulated
  components: `mock/navigation`, `mock/person_detection`, `mock/system_information` and the
  test fixture `mock/fault`;
- the **OpenRoIS Inspector**, served on `http://localhost:8080`.

## 3. Open the Inspector

Open [http://localhost:8080/?autoconnect=1](http://localhost:8080/?autoconnect=1). The
Inspector connects to the gateway, calls `rois.system.get_profile`, and shows the engines
behind it and their components.

<figure className="openrois-figure">
  <img src="/img/inspector.png" alt="The OpenRoIS Inspector connected to the gateway, showing the engine tree with the mock engine and its components, the Commands tab of mock/navigation after a start command that ended OK, and the activity log of JSON-RPC messages." />
  <figcaption>The Inspector knows nothing about these components in advance. Everything on screen comes from the engine profile.</figcaption>
</figure>

Things to try:

- On the overview, the **Try This** cards read the robot position, watch for people, and
  drive to a target with `bind`, `execute` and `release`.
- Open a component to read its profile, get and set its parameters, run its queries and
  commands, and subscribe to its events.
- In **Command Sequence**, combine steps and a concurrent group of branches into one
  `execute` call, then follow every command id until it completes.
- Turn on **SDK Calls** to see the `@openrois/sdk` TypeScript for each action, and open
  the activity log to see every JSON-RPC 2.0 message.

## What Just Happened

- The gateway published an **HRI Engine profile** describing the components of every engine
  behind it.
- The Inspector discovered the components at runtime instead of hardcoding them. This is
  what lets one RoIS application work with any robot behind the gateway.
- Commands followed the RoIS reservation lifecycle: `bind`, then `execute`, then
  `release`.

Stop the stack with `docker compose down`.

## Next Steps

- Read how the pieces fit together in the [architecture](../concepts/architecture.md).
- Write your own [service application](../guides/service-application.md) with the
  JavaScript, Python or Unity SDK.
- Connect a real platform by writing a [component and adapter](../guides/components-and-adapters.md).
