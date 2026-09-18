---
sidebar_label: Write Components and Adapters
sidebar_position: 2
description: Connect a robot, avatar, or service to OpenRoIS by writing decorated Python components and an adapter.
---

# Write Components and Adapters

A **component** translates the RoIS interface of one function, such as Navigation, into
calls to your platform. An **adapter** is the process that hosts your components in a sub
HRI Engine and connects them to the gateway. This guide builds both in Python.

Install the packages first, as described in [installation](../getting-started/installation.md).

## Declare a Component

Decorate a class with `@component`, and its methods with `@query`, `@invoke`, and
`@subscribe`. The decorators build the component profile that applications discover.

```python title="navigation.py"
from openrois.interfaces.bus import InvokeResponse
from openrois.interfaces.hri import ReturnCode
from openrois_components_core import component, invoke, query, results, subscribe


@component(
    "Navigation",
    parameters=[
        {"name": "target_positions", "data_type_ref": "string[]"},
        {"name": "time_limit", "data_type_ref": "int", "default_value": "0"},
    ],
)
class Navigation:
    def __init__(self, config: dict) -> None:
        self._robot_url = config["robot_url"]
        self._target = ""
        self._client = None

    async def connect(self) -> None:
        # Open the connection to your platform: a ROS 2 node, a gRPC channel, an HTTP client.
        self._client = await MyRobotClient.open(self._robot_url)

    async def disconnect(self) -> None:
        await self._client.close()

    @query("component_status")
    async def status(self):
        return results.status("BUSY" if self._client.moving else "READY")

    @invoke("set_parameter")
    async def set_parameter(self, parameters):
        for p in parameters:
            if p["name"] == "target_positions":
                self._target = p["value"]
        return InvokeResponse(return_code=ReturnCode.OK)

    @invoke("start")
    async def start(self, parameters):
        await self._client.go_to(self._target)
        return InvokeResponse(return_code=ReturnCode.OK, command_id="nav-1")

    @invoke("stop")
    async def stop(self, parameters):
        await self._client.cancel()
        return InvokeResponse(return_code=ReturnCode.OK)

    @subscribe("reached_target")
    async def on_reached_target(self):
        """Called when an application subscribes. Events are emitted separately."""
```

Declare only the operations your platform supports. The profile tells applications
exactly what is available.

### Function Classification

`@component` derives the RoIS function of the 17 basic components automatically:
Navigation, Move, Follow, Reaction, and Speech Synthesis are **actuation** components, and
the perception components are **sensing** components. The gateway requires a reservation
with `bind` before commanding an actuation component. For your own components, pass the
classification explicitly, for example `@component("Gripper", function="actuation")`.

## Handlers

| Decorator | Handler signature | Returns |
|-----------|-------------------|---------|
| `@query("name")` | `async def handler(self)` | A list of `Result` |
| `@invoke("name")` | `async def handler(self, parameters)` | An `InvokeResponse` |
| `@subscribe("name")` | `async def handler(self)` | Nothing |

`parameters` is a list of `{"name", "data_type_ref", "value"}` dictionaries, with values
encoded as strings. The `results` module builds common result lists, such as
`results.status()`, `results.robot_position()`, and `results.reached_target()`.

## Emit Events

The framework injects `self.parent` when the component is registered. Emit an event from
anywhere in the component, and the framework delivers it to every subscribed application.
Emitting with no subscribers is a no-op.

```python
await self.parent.emit_async(
    "Navigation",
    "reached_target",
    results.reached_target(target=self._target, is_final_target=True),
)
```

From a thread that is not the asyncio event loop, such as a ROS 2 callback, use the
thread-safe `self.parent.emit(...)` with the same arguments.

## Report Completion

A command handler returns as soon as the command is accepted, with a `command_id`. When
the work behind it finishes, report it, and the application that issued the command
receives `rois.command.completed` with the status and any final results:

```python
await self.parent.complete_async(command_id, "OK", results.reached_target(target, True))
```

The thread-safe form is `self.parent.complete(command_id, "OK")`. The status is one of the
RoIS completed statuses: `OK`, `ERROR`, `ABORT`, `OUT_OF_RESOURCES`, or `TIMEOUT`. A handler
that raises an exception answers `ERROR` and the caller receives `rois.system.notify_error`
with a `COMPONENT_INTERNAL_ERROR`, retrievable later through `rois.system.get_error_detail`.

## Write the Adapter

The adapter creates a sub HRI Engine, registers the components, and connects to the
gateway. Configuration comes from a profile file.

```yaml title="openrois-profile.yaml"
engine:
  id: robot_1
  platform: my_robot
  gateway_url: "ws://127.0.0.1:8765"

environment:
  robot_url: "http://192.168.0.10:8080"

components:
  Navigation:
    time_limit: 60
```

```python title="adapter.py"
from openrois_core import Engine, WsClient, component_config, read_profile
from openrois_components_core import meta_from_decorators

from navigation import Navigation

profile = read_profile("openrois-profile.yaml")

engine = Engine(
    engine_id=profile["engine"]["id"],
    platform=profile["engine"]["platform"],
)
engine.register_component(
    "Navigation",
    Navigation(component_config(profile, "Navigation")),
    meta_from_decorators(Navigation),
)

WsClient(engine, profile["engine"]["gateway_url"]).run()
```

`component_config` merges the `engine`, `environment`, and per-component sections, with
the per-component values taking precedence. `WsClient.run()` calls `connect()` on every
component, connects to the gateway on its `/adapter` path, and reconnects with
exponential backoff if the connection drops.

## ROS 2 Components

A component backed by ROS 2 creates its own `rclpy` node in `connect()` and stores it as
`self._node`. The adapter detects these nodes and spins them in a background thread, so
ROS 2 callbacks run alongside the asyncio event loop. Protect state shared between the two
with a lock, and emit events from callbacks with the thread-safe `self.parent.emit(...)`.

## One Package, Several Backends

When a component can talk to a platform in more than one way, ship one class per backend,
all decorated with the same component name. The reference components for the Preferred
Robotics Kachaka provide `GrpcNavigation` and `Ros2Navigation`. Each adapter imports the
class it needs, so the backend is selected at import time, without factories or runtime
switches.

## Check Conformance

`openrois_components_core.conformance` drives your engine through the RoIS operations
the way an application would and lists every rule a component breaks: the profile must
validate against the normative models, every declared query must answer with well-formed
results (`get_stream_status` excepted, since it needs an open stream), every basic
component except System Information must answer `component_status`, actuation components
must accept `start`, `stop`, `suspend`, and `resume`, `set_parameter` must round-trip
through `get_parameter`, every event must accept a subscription, and a basic component
whose messages OpenRoIS has typed (Person Detection, Navigation, Reaction, System
Information, Audio Streaming, Video Streaming) must not invent message names.

```python
from openrois_components_core.conformance import assert_conformant


async def test_my_adapter() -> None:
    await assert_conformant(engine)
```

Run it in your adapter's test suite. The reference components and the mock adapter pass it
in the OpenRoIS continuous integration.

## Next Steps

- Start from the adapter template in
  [`examples/adapter-template`](https://github.com/openrois/openrois/tree/dev/examples/adapter-template).
- Study the reference components in
  [`components/kachaka`](https://github.com/openrois/openrois/tree/dev/components/kachaka).
- Check which RoIS components exist today in the [component reference](../reference/components.md).
