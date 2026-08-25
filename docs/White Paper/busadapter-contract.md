---
sidebar_label: SubEngine Contract
sidebar_position: 6
---

# The SubEngine Contract

The `SubEngine` is the single abstraction that decouples the engine from any
paradigm. The engine and SDK depend only on this five-method contract. They
never reference ROS, DDS, gRPC, or a game engine.

```mermaid
classDiagram
    class SubEngine {
        <<protocol>>
        +discover(filter) ComponentRef[]
        +invoke(ref, command) CommandResult
        +query(ref, query) Result
        +subscribe(ref, sink) SubscribeId
        +unsubscribe(subscribeId) ReturnCode
    }

    class RemoteSubEngine {
        WebSocket connection
        JSON-RPC 2.0 forwarding
        event routing
    }

    class LocalSubEngine {
        in-process registry
        direct method calls
        (future)
    }

    SubEngine <|.. RemoteSubEngine
    SubEngine <|.. LocalSubEngine
```

## Method semantics

| Method | Purpose | Example |
|--------|---------|---------|
| `discover` | Find components by condition | DDS discovery, registry lookup, service registry |
| `invoke` | Execute a command (start, stop, execute, set_parameter) | ROS 2 action or service, direct method call, gRPC unary |
| `query` | Synchronous read (component_status, get_parameter) | ROS 2 service, direct method call, gRPC unary |
| `subscribe` | Async event push (notify_event, notify_stream_status) | ROS 2 topic subscription, callback / language event, gRPC server-stream |
| `unsubscribe` | Cancel an event subscription | ROS 2 topic unsubscribe, remove callback, cancel gRPC stream |

## RoIS operation to SubEngine method mapping

The RoIS interface operations map to SubEngine methods as follows:

- Synchronous operations (`query`, `get_parameter`, `component_status`) map to
  `query`.
- Command and long-running operations (`execute`, `start`, `set_parameter`) map to
  `invoke`.
- Async push operations (`notify_event`, `notify_stream_status`) map to `subscribe`
  plus an event sink.

## Why five methods

The contract is deliberately kept to five methods. Adding transport-specific knobs
(QoS policies, deadlines, reliability) to the contract would leak paradigm
assumptions into the engine. Instead, QoS, deadlines, and reliability belong to
whichever sub-engine needs them. A ROS 2 sub-engine needs DDS QoS. An avatar sub-engine does
not. Keeping the contract minimal means the engine can drive a ROS 2
robot fleet, a virtual avatar, or a distributed set of AI services with the
same code path.

Because the engine sees only `SubEngine`, accidental coupling (for example, baking
DDS QoS semantics into the engine) is structurally prevented. The same contract test
suite runs against every sub-engine, catching paradigm leakage.

## Three contracts

OpenRoIS defines three contracts at three boundaries:

1. **Service application to Engine.** The service application (operator app, script,
   dashboard) connects to the engine over WebSocket and sends JSON-RPC 2.0 messages.
   This is the remote control boundary. The SDK wraps this transport.

2. **Engine to SubEngine.** The engine connects to each sub-engine over
   WebSocket and forwards RoIS operations as JSON-RPC 2.0 calls. The SubEngine
   interface defines the five methods (`discover`, `invoke`, `query`, `subscribe`,
   `unsubscribe`) that every sub-engine must implement. The engine never references the
   sub-engine's internal transport (DDS, gRPC, animation API).

3. **SubEngine to Component.** Inside the sub-engine, individual RoIS components are
   registered as handlers. Each component exposes RoIS operations (command, query,
   event) via decorators or explicit registration. The sub-engine dispatches incoming
   JSON-RPC calls to the matching component handler. This is the sub-engine's internal
   concern, not visible to the engine.