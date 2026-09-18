---
sidebar_label: Write a Service Application
sidebar_position: 1
description: Use the OpenRoIS TypeScript SDK to discover, query, command, and receive events from RoIS components.
---

# Write a Service Application

A service application uses a client SDK to talk to the gateway. This guide uses the
TypeScript SDK, `@openrois/sdk`, which runs in browsers and in Node.js. See
[installation](../getting-started/installation.md) to add it to a project, and the
[quickstart](../getting-started/quickstart.md) for an engine to test against.

## Connect

```ts
import { RoISClient } from "@openrois/sdk";

const client = await RoISClient.connect("ws://localhost:8765");
```

`connect` opens the WebSocket and performs `rois.system.connect`. Call
`client.disconnect()` when you are done, which also releases any components you bound.

## Discover Components

Component references have the form `engine_id/ComponentName`, for example
`robot_1/Navigation`. Do not hardcode them. Discover them instead:

```ts
// All component references, across every connected robot.
const refs = await client.search();

// The full engine profile: components with their queries, commands, and events.
const profile = await client.getProfile();
```

Building your interface from the profile is what lets one application work with any
platform. A component that does not list `suspend` among its commands should not get a
suspend button.

The gateway notifies you when robots connect or leave:

```ts
client.on("notification", async (n) => {
  if (n.method === "rois.system.profile_changed") {
    const updated = await client.getProfile();
    // Refresh your view.
  }
});
```

## Query State

Queries are synchronous and do not require a reservation.

```ts
const results = await client.query("robot_1/Navigation", "component_status");
// [{ name: "status", data_type_ref: "Component_Status", value: "1" }]
```

RoIS results are lists of `{ name, data_type_ref, value }` entries, with every value
encoded as a string.

## Subscribe to Events

```ts
client.on("reached_target", (notification) => {
  console.log("Arrived:", notification.params.results);
});

const subscriptionId = await client.subscribe("robot_1/Navigation", "reached_target");

// Later:
await client.unsubscribe(subscriptionId);
```

The client emits each event under its event type, and also as the generic
`rois.event.notify` notification.

## Command a Component

Actuation components, such as Navigation, follow the RoIS reservation lifecycle. Bind the
component, configure it, execute, and release it when done. While you hold the
reservation, other applications receive `OUT_OF_RESOURCES` if they try to bind it.

```ts
const nav = "robot_1/Navigation";

await client.bind(nav);
await client.setParameter(nav, [
  { name: "target_positions", data_type_ref: "string[]", value: '["kitchen"]' },
]);
await client.execute(nav, { command_type: "start" });

// ... wait for reached_target ...

await client.release(nav);
```

Sensing components, such as PersonDetection, can be started and queried without
exclusive reservation.

## Handle Errors

Operations that return a RoIS return code other than `OK` throw a `RoISError` carrying the
code and the method name. Transport problems throw subclasses of `TransportError`.

```ts
import { RoISClient, RoISError } from "@openrois/sdk";

try {
  await client.bind("robot_1/Navigation");
} catch (err) {
  if (err instanceof RoISError && err.returnCode === "OUT_OF_RESOURCES") {
    // Another application holds the reservation.
  } else {
    throw err;
  }
}
```

| Error | Raised when |
|-------|-------------|
| `RoISError` | The engine returns `ERROR`, `BAD_PARAMETER`, `UNSUPPORTED`, `OUT_OF_RESOURCES`, or `TIMEOUT` |
| `ConnectionError` | The WebSocket cannot be opened or closes unexpectedly |
| `RequestTimeoutError` | No response arrives within the request timeout (30 seconds by default) |
| `RpcError` | The gateway returns a JSON-RPC error object |

## Authentication

The alpha gateway does not authenticate connections yet. When it does, tokens will be
passed at the WebSocket upgrade. The SDK already accepts a custom `webSocketFactory` in
its transport options for this purpose. See [security](../concepts/security.md).

## Other Languages

The C# SDK for Unity applications is [in progress](../project/roadmap.md). Any language
with a WebSocket client can use OpenRoIS directly through the
[wire protocol](../reference/wire-protocol.md).
