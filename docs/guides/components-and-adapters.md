---
sidebar_label: Write Components and an Adapter
sidebar_position: 4
description: Connect a physical robot, virtual avatar, or digital service to OpenRoIS by writing Python components and an adapter.
---

# Write Components and an Adapter

A **component** implements one RoIS component type, such as Navigation, by calling your
platform. An **adapter** is the process that hosts your components in a sub HRI Engine and
connects them to the gateway. This guide builds both in Python.

Install the packages first, as described in [installation](../getting-started/installation.md):

```bash
pip install openrois-components-core openrois-engine
```

## Declare a Component

A component is a subclass of `Component`. `@component` declares the RoIS type it
implements, and `@command`, `@query` and `@event` mark the RoIS messages of that type it
handles.

```python title="navigation.py"
from openrois.components.core import CommandFailed, Component, command, component, event
from openrois.interfaces.components import NAVIGATION_PROFILE
from openrois.interfaces.service import CompletedStatus


@component(NAVIGATION_PROFILE)
class Navigation(Component):
    def __init__(self, robot_url: str) -> None:
        self._robot_url = robot_url

    async def connect(self) -> None:
        # Open the connection to your platform: a gRPC channel, an HTTP client.
        self._robot = await MyRobotClient.open(self._robot_url)

    async def disconnect(self) -> None:
        await self._robot.close()

    @command("start")
    async def start(self) -> None:
        target = self.parameters["target_positions"][0]
        if not await self._robot.knows(target):
            raise CommandFailed(CompletedStatus.ERROR, f"unknown place {target}")
        await self._robot.go_to(target)  # the command runs until the robot arrives
        self.emit("reached_target", target=target, is_final_target=True)

    @command("stop")
    async def stop(self) -> None:
        await self._robot.halt()

    @event("reached_target")
    async def reached_target(self) -> None:
        pass  # start emits the event when the robot arrives.
```

`@component` takes the profile of the component type. For a basic RoIS component, pass its
constant from `openrois.interfaces.components`, such as `NAVIGATION_PROFILE`. For a type
of your own, pass a full `HRIComponentProfile`. Every handler is checked against the
profile when the class is defined, so a message the profile does not define fails at
import, not at run time.

## What the Engine Serves

A component implements the part of its type that your platform supports. The engine
serves the commands, queries and events the class handles, and answers
`component_status` itself. A type that includes RoIS_Common, as every basic type but
System Information does, always serves `start`, `stop`, `suspend` and `resume`:

- `stop`, or a new `start`, cancels the running `start`, which ends with `ABORT`.
- `suspend` holds the component's later commands and drops its events, and `resume`
  releases them.
- A handler for any of the four adds to this behavior, for example to pause a detector.

Applications discover exactly what is served from the profile, and never see a message
the component does not answer.

## Handlers

| Decorator | Marks | The method |
|-----------|-------|------------|
| `@command("name")` | A command message | Takes the command's arguments by name, runs for as long as the command lasts, and returns its results by name |
| `@query("name")` | A query message | Takes the query's arguments by name and returns its results by name |
| `@event("name")` | An event message the component emits | Runs on each new subscription, for example to start a detector, and may do nothing |

Arguments arrive converted from their profile types, and results are written in the form
their profile types take on the wire, so names and types always come from the profile.

A command ends with `OK` when its handler returns. `CommandFailed(status)` ends it with
`ERROR`, `ABORT`, `OUT_OF_RESOURCES` or `TIMEOUT`, and any other exception with `ERROR`.
The application that issued the command receives `rois.command.completed`, and reads the
results with `get_command_result`.

## Parameters

`self.parameters` holds the current parameter values, converted from their profile types.
The engine stores them, fills them from the profile defaults and answers `get_parameter`.
To apply new values to your platform, or to refuse them, handle the `set_parameter`
command. Its handler takes the new values as one mapping, after the engine has checked
them against the profile:

```python
    @command("set_parameter")
    async def apply(self, values: Mapping[str, Any]) -> None:
        if "routing_policy" in values:
            await self._robot.set_policy(values["routing_policy"])
```

Raising refuses the values, the engine keeps the old ones, and the application receives
`BAD_PARAMETER`.

## Emit Events

`self.emit` sends an event with its results by name to every subscribed application. It
is safe to call from any thread, for example a ROS 2 callback. Emitting with no
subscribers does nothing.

```python
self.emit("reached_target", target=target, is_final_target=True)
```

## Report Status

A component reports trouble with `self.raise_status(ComponentStatus.WARNING, "The battery
is low.")` or with `ERROR`, and withdraws it with `self.clear_status()`. Applications see
it in `component_status` and receive `rois.system.notify_error`. While `ERROR` is raised,
the engine refuses the component's commands and queries.

## Share a Connection

A connection that several components of one adapter share, such as one robot SDK client,
is a `Resource`. The adapter builds it and hands it to each component, which records it
with `self.uses(resource)`. The engine opens it before the first of them connects, and
closes it after the last one disconnects:

```python
from openrois.components.core import Resource


class RobotConnection(Resource):
    def __init__(self, address: str) -> None:
        self.address = address

    async def open(self) -> None:
        self.client = await MyRobotClient.open(self.address)

    async def close(self) -> None:
        await self.client.close()


@component(NAVIGATION_PROFILE)
class Navigation(Component):
    def __init__(self, robot: RobotConnection) -> None:
        self._robot = self.uses(robot)
```

## Write the Adapter

The adapter reads its settings, hosts the components in an engine, and connects to the
gateway:

```python title="my_adapter.py"
from openrois.engine import Engine, WsClient
from openrois.engine.config import AdapterConfig, load_adapter_config


class MyAdapterConfig(AdapterConfig):
    engine_id: str = "robot_1"


config = load_adapter_config(MyAdapterConfig)
robot = RobotConnection(config.robot_address)
engine = Engine(config.engine_id)
engine.add_component("navigation", Navigation(robot))
WsClient(engine, config.gateway_url).run()
```

Applications see the component as `robot_1/navigation`. `WsClient` opens the shared
resources, connects the components, serves the gateway until Ctrl+C, and reconnects with
a growing delay if the connection drops.

The settings come from the defaults of the model, then the YAML file named by `--config`
or `OPENROIS_ADAPTER_CONFIG`, then the environment, then the flags:

```yaml title="adapter.yaml"
gateway_url: ws://127.0.0.1:8765
engine_id: robot_1
robot_address: http://192.168.0.10:8080
log_level: info
```

The environment variables (`OPENROIS_ADAPTER_GATEWAY_URL`, `OPENROIS_ADAPTER_ENGINE_ID`,
`OPENROIS_ADAPTER_ROBOT_ADDRESS`, `OPENROIS_ADAPTER_LOG_LEVEL`) and the matching flags
set the four common settings. Sections of your own, for your components, come from the
file.

## ROS 2 Components

The components of a ROS 2 adapter share one `RclpyExecutor`, from
`openrois.components.core.ros2`. Each component records it with `self.uses`, creates its
node in `connect()` and hands it over with `add_node`. The executor is a resource, so the
engine opens it before the components connect and closes it after they disconnect. Node
callbacks run on the executor's threads, and emit events with the thread-safe
`self.emit`.

## Next Steps

- Start from the adapter template in
  [`examples/adapter-template`](https://github.com/openrois/openrois/tree/dev/examples/adapter-template).
- Study a complete adapter:
  [openrois-adapter-reachy-mini](https://github.com/openrois/openrois-adapter-reachy-mini),
  or [openrois-adapter-kachaka](https://github.com/openrois/openrois-adapter-kachaka) for an
  adapter over the gRPC API of a robot.
- Check which RoIS components exist today in the [component reference](../reference/components.md).
