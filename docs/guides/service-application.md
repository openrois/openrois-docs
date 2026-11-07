---
sidebar_label: Write a Service Application
sidebar_position: 1
description: Use the OpenRoIS JavaScript SDK to discover, query, command, and receive events from RoIS components.
---

# Write a Service Application

A service application uses a client SDK to talk to the gateway. This guide uses the
JavaScript SDK, `@openrois/sdk`, which runs in browsers and in Node.js. The Python and Unity
SDKs have the same surface, in their own naming. See
[installation](../getting-started/installation.md) to add an SDK to a project, and the
[quick start](../getting-started/quickstart.md) for a gateway to test against.

## Connect

```ts
import { RoISClient, componentRef, componentType } from "@openrois/sdk";

const client = await RoISClient.connect("ws://localhost:8765");
```

`connect` opens the WebSocket and performs `rois.system.connect`. Call
`client.disconnect()` when you are done, which also releases what you bound. One client is
one session: after the connection closes, connect again, then bind and subscribe again.

## Discover Components

Component references have the form `engine_id/name`, for example `mock/navigation`. Do not
hardcode them. Find them with a condition instead:

```ts
// Every component of a type, across every connected robot.
const [nav] = await client.search(componentType({ authority: "OMG", code: "Navigation" }));
const target = componentRef(nav);

// The engine profile, and the profile of every component it lists.
const { profile, component_profiles } = await client.getProfile();
```

Building your interface from the profile is what lets one application work with any
platform. A component that does not list `suspend` among its commands should not get a
suspend button.

The gateway notifies you when components join or leave:

```ts
client.on("rois.system.profile_changed", async () => {
  const updated = await client.getProfile();
  // Refresh your view.
});
```

## Query State

Queries do not require a reservation.

```ts
const results = await client.query("component_status", target);
```

RoIS results are lists of `{ name, data_type_ref, value }` entries, with every value
encoded as a string. `decodeValue` from `@openrois/interfaces` reads a value by its type.

## Subscribe to Events

```ts
client.on("rois.event.notify_event", ({ event_type, results }) => {
  console.log(event_type, results);
});

const subscribeId = await client.subscribe("reached_target", target);

// Later:
await client.unsubscribe(subscribeId);
```

The listener receives every event of every subscription, so filter by `subscribe_id` or
`event_type` when you hold several.

## Command a Component

Actuation components, such as Navigation, follow the RoIS reservation lifecycle. Bind the
component, configure it, execute, and release it when done. While you hold the
reservation, other applications receive `OUT_OF_RESOURCES` if they try to bind it.

`execute` returns the command ids as soon as the engine accepts the commands. Each command
ends later, with a `rois.command.completed` notification. A command can end before the reply
reaches your code, so add the listener first and record each status by id:

```ts
const statuses = new Map<string, string>();
const waiters = new Map<string, () => void>();
client.on("rois.command.completed", ({ command_id, status }) => {
  statuses.set(command_id, status);
  waiters.get(command_id)?.();
});

await client.bind(nav);
await client.setParameter(nav, [
  { name: "target_positions", data_type_ref: "string[]", value: '["kitchen"]' },
]);
const [commandId] = await client.execute([{ component_ref: nav, command_type: "start" }]);

// Wait before release, which aborts a running command.
if (!statuses.has(commandId)) {
  await new Promise<void>((resolve) => waiters.set(commandId, resolve));
}
console.log(statuses.get(commandId)); // "OK"

await client.release(nav);
```

Sensing components, such as PersonDetection, can be started and queried without an
exclusive reservation.

## Handle Errors

Operations that return a RoIS return code other than `OK` throw a `RoISError` carrying the
code and the method. Transport problems throw subclasses of `TransportError`.

```ts
import { RoISError } from "@openrois/sdk";

try {
  await client.bind(nav);
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
| `ConnectionError` | The WebSocket cannot be opened, or closes while a request waits |
| `RequestTimeoutError` | No response arrives within the request timeout, 30 seconds by default |
| `RpcError` | The gateway returns a JSON-RPC error object |

## Authentication

The alpha gateway does not authenticate connections, so use it on trusted networks only.
See [security](../concepts/security.md).

## Other Languages

The [Python and Unity SDKs](../reference/sdks.md) cover asyncio and Unity applications with
the same surface. Any language with a WebSocket client can use OpenRoIS directly through the
[wire protocol](../reference/wire-protocol.md).
