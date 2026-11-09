---
sidebar_label: Write a Service Application
sidebar_position: 2
description: Use the OpenRoIS JavaScript or Python SDK to discover, query, command, and receive events from RoIS components.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Write a Service Application

A service application uses a client SDK to talk to the gateway. This guide shows the
JavaScript SDK, `@openrois/sdk`, for browsers and Node.js, and the Python SDK,
`openrois-sdk`, for asyncio. The Unity SDK has the same methods in Pascal case with an
`Async` suffix, listed in the [SDK reference](../reference/sdks.md). See
[installation](../getting-started/installation.md) to add an SDK to a project, and the
[quick start](../getting-started/quickstart.md) for a gateway to test against.

The [Inspector](inspector.md) shows the SDK calls for anything you do in it, which is a
quick way to find the calls an application needs.

## Connect

<Tabs groupId="sdk">
<TabItem value="js" label="JavaScript">

```ts
import { RoISClient, componentRef, componentType } from "@openrois/sdk";

const client = await RoISClient.connect("ws://localhost:8765");
```

</TabItem>
<TabItem value="py" label="Python">

```python
from openrois.interfaces import RoISIdentifierType
from openrois.sdk import RoISClient, component_ref, component_type

client = await RoISClient.connect("ws://localhost:8765")
```

</TabItem>
</Tabs>

`connect` opens the WebSocket and performs `rois.system.connect`. Call
`client.disconnect()` when you are done, which also releases what you bound. In Python,
`async with RoISClient.connect(url) as client:` disconnects at the end of the block.

One client is one session. Bindings and subscriptions end with it, and the SDKs do not
reconnect on their own: after the connection closes, connect again, then bind and
subscribe again.

## Discover Components

Component references have the form `engine_id/name`, for example `mock/navigation`. Do not
hardcode them. Find them with a condition instead:

<Tabs groupId="sdk">
<TabItem value="js" label="JavaScript">

```ts
// Every component of a type, across every connected robot.
const [nav] = await client.search(componentType({ authority: "OMG", code: "Navigation" }));
const target = componentRef(nav);

// The engine profile, and the profile of every component it lists.
const { profile, component_profiles } = await client.getProfile();
```

</TabItem>
<TabItem value="py" label="Python">

```python
# Every component of a type, across every connected robot.
navigation = RoISIdentifierType(authority="OMG", code="Navigation")
[nav] = await client.search(component_type(navigation))
target = component_ref(nav)

# The engine profile, and the profile of every component it lists.
engine_profile = await client.get_profile()
```

</TabItem>
</Tabs>

Building your interface from the profile is what lets one application work with any
platform. A component that does not list `suspend` among its commands should not get a
suspend button.

The gateway notifies you when components join or leave. Listen for
`rois.system.profile_changed` with `client.on`, and read the profile again.

## Query State

Queries do not require a reservation.

<Tabs groupId="sdk">
<TabItem value="js" label="JavaScript">

```ts
const results = await client.query("component_status", target);
```

</TabItem>
<TabItem value="py" label="Python">

```python
results = await client.query("component_status", target)
```

</TabItem>
</Tabs>

RoIS results are lists of `{ name, data_type_ref, value }` entries, with every value
encoded as a string. `decodeValue` from `@openrois/interfaces`, and `decode_value` from
`openrois.interfaces`, read a value by its type.

## Subscribe to Events

<Tabs groupId="sdk">
<TabItem value="js" label="JavaScript">

```ts
client.on("rois.event.notify_event", ({ event_type, results }) => {
  console.log(event_type, results);
});

const subscribeId = await client.subscribe("reached_target", target);

// Later:
await client.unsubscribe(subscribeId);
```

</TabItem>
<TabItem value="py" label="Python">

```python
client.on(
    "rois.event.notify_event",
    lambda event: print(event.event_type, event.results),
)

subscribe_id = await client.subscribe("reached_target", target)

# Later:
await client.unsubscribe(subscribe_id)
```

</TabItem>
</Tabs>

The listener receives every event of every subscription, so filter by `subscribe_id` or
`event_type` when you hold several.

## Command a Component

Actuation components, such as Navigation, follow the RoIS reservation lifecycle. Bind the
component, configure it, execute, and release it when done. While you hold the
reservation, other applications receive `OUT_OF_RESOURCES` if they try to bind it.

`execute` returns the command ids as soon as the engine accepts the commands. Each command
ends later, with a `rois.command.completed` notification. A command can end before the reply
reaches your code, so add the listener first and record each status by id:

<Tabs groupId="sdk">
<TabItem value="js" label="JavaScript">

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

</TabItem>
<TabItem value="py" label="Python">

```python
import asyncio
from collections import defaultdict

from openrois.interfaces import CompletedParams

statuses: dict[str, str] = {}
ended: defaultdict[str, asyncio.Event] = defaultdict(asyncio.Event)

def on_completed(completed: CompletedParams) -> None:
    statuses[completed.command_id] = completed.status
    ended[completed.command_id].set()

client.on("rois.command.completed", on_completed)

await client.bind(nav)
await client.set_parameter(
    nav,
    [{"name": "target_positions", "data_type_ref": "string[]", "value": '["kitchen"]'}],
)
[command_id] = await client.execute([{"component_ref": nav, "command_type": "start"}])

# Wait before release, which aborts a running command.
await asyncio.wait_for(ended[command_id].wait(), timeout=30)
print(statuses[command_id])  # "OK"

await client.release(nav)
```

</TabItem>
</Tabs>

Sensing components, such as PersonDetection, can be started and queried without an
exclusive reservation.

## Run a Sequence

One `execute` can carry several commands. They run in order, and a group with a
`branch_list` runs its branches at the same time, each branch in order. The next step
waits for every branch. Here a robot drives to a place, then speaks and reacts together,
half a second later:

<Tabs groupId="sdk">
<TabItem value="js" label="JavaScript">

```ts
const commandIds = await client.execute([
  { component_ref: nav, command_type: "start" },
  {
    branch_list: [
      { command_list: [{ component_ref: speech, command_type: "start" }] },
      { command_list: [{ component_ref: reaction, command_type: "start" }] },
    ],
    delay_time: 500,
  },
]);
```

</TabItem>
<TabItem value="py" label="Python">

```python
command_ids = await client.execute([
    {"component_ref": nav, "command_type": "start"},
    {
        "branch_list": [
            {"command_list": [{"component_ref": speech, "command_type": "start"}]},
            {"command_list": [{"component_ref": reaction, "command_type": "start"}]},
        ],
        "delay_time": 500,
    },
])
```

</TabItem>
</Tabs>

The engine assigns one id to each command and returns them in order, branch by branch.
Every component in the sequence must be bound first. When a command does not end `OK`,
the rest of its branch and every later step end with `ABORT` and never start. A `set_parameter` command in the
sequence configures a component right before the command that reads the parameter.

## Handle Errors

Operations that return a RoIS return code other than `OK` raise a `RoISError` carrying the
code and the method. Transport problems raise subclasses of `TransportError`.

<Tabs groupId="sdk">
<TabItem value="js" label="JavaScript">

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

</TabItem>
<TabItem value="py" label="Python">

```python
from openrois.interfaces import ReturnCode
from openrois.sdk import RoISError

try:
    await client.bind(nav)
except RoISError as error:
    if error.return_code is ReturnCode.OUT_OF_RESOURCES:
        ...  # Another application holds the reservation.
    else:
        raise
```

</TabItem>
</Tabs>

| Error | Raised when |
|-------|-------------|
| `RoISError` | The engine returns `ERROR`, `BAD_PARAMETER`, `UNSUPPORTED`, `OUT_OF_RESOURCES`, or `TIMEOUT` |
| `ConnectionError` (`RoISConnectionError` in Python) | The WebSocket cannot be opened, or closes while a request waits |
| `RequestTimeoutError` | No response arrives within the request timeout, 30 seconds by default |
| `RpcError` | The gateway returns a JSON-RPC error object |

A command that fails after it was accepted does not raise: it ends with a status other
than `OK` in `rois.command.completed`. An engine also reports faults of its components
with `rois.system.notify_error`, and `getErrorDetail` (`get_error_detail`) reads the
detail.

## Security

The gateway does not authenticate connections yet, so use it on trusted networks only.
See [deployment](../concepts/deployment.md#security).

## Other Languages

Any language with a WebSocket client can use OpenRoIS directly through the
[wire protocol](../reference/wire-protocol.md).
