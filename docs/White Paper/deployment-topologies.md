---
sidebar_label: Deployment Topologies
sidebar_position: 10
---

# Deployment Topologies

The same four layers compose into different physical deployments. The client SDK and
gateway are constant. Only the BusAdapter and host layout change.

## Topology A: Physical robot with web/Unity operator (primary)

The reference scenario: an operator application controls a ROS 2 robot over the
internet. The robot runs a sub-engine and component nodes. The Python gateway
bridges DDS to the remote client over WebSocket.

```mermaid
flowchart LR
    subgraph Operator["Operator side"]
        App["Operator App<br/>(Unity or Web)<br/>+ RoIS SDK"]
    end

    subgraph GatewaySide["Gateway side"]
        GW["Gateway<br/>(Python, asyncio)"]
    end

    subgraph RobotSide["Robot side"]
        Robot["ROS 2 Robot<br/>Nav2, YOLO, perception<br/>system_information"]
    end

    App -->|"WebSocket / TLS<br/>JSON-RPC 2.0"| GW
    GW -->|"ROS 2 / DDS<br/>ROS2BusAdapter"| Robot
    App -.->|"WebRTC (SRTP/DTLS)<br/>media plane"| Robot
```

This is the primary demonstrated path and the MVP target (M5). From a clean checkout,
an operator can bring up the gateway and mock robot and control it from a browser or
Unity application.

## Topology B: Mixed fleet (multiple adapters at once)

One gateway can host several adapters simultaneously. For example, a physical robot
(ROS 2) and a virtual concierge avatar (in-process) behind the same SDK endpoint.
This is the strongest proof the interfaces are paradigm-neutral.

```mermaid
flowchart TB
    App["Operator App<br/>+ RoIS SDK"]
    GW["Gateway"]
    App -->|"WebSocket / TLS"| GW

    GW -->|"ROS2BusAdapter"| Robot["Physical Robot<br/>(ROS 2 / DDS)"]
    GW -->|"InProcessBusAdapter"| Avatar["Virtual Avatar<br/>(in-process)"]
```

The mixed-paradigm test (M8) demonstrates that `search()` returns components from both
adapters, and the SDK controls each identically through one endpoint.

## Topology C: Single-process avatar (secondary)

The simplest deployment: engine, gateway, and components live in one process (for
example, a Unity game, a Godot app, or a Node/browser runtime). No serialization, no
network bus.

```mermaid
flowchart LR
    subgraph AvatarProcess["Avatar Process (single process)"]
        direction LR
        Engine["Engine + Gateway"]
        Bus["InProcessBusAdapter<br/>(direct method calls)"]
        Components["Components<br/>FaceDetection, Reaction,<br/>SpeechSynthesis"]
        Engine --> Bus --> Components
    end

    Remote["Remote Client<br/>(optional)"]
    Remote -.->|"WebSocket (optional)"| Engine
```

This topology is ideal for development and testing. It requires no external
dependencies and runs the full RoIS lifecycle in memory.

## Topology D: Multi-process services (secondary)

A front-end plus separate AI services (perception, ASR/TTS) that may run on a GPU box
or in containers.

```mermaid
flowchart TB
    App["Web / Unity Client<br/>(engine + gateway)"]
    App -->|"gRPCBusAdapter"| Perception["Perception Service<br/>(gRPC)"]
    App -->|"gRPCBusAdapter"| ASR["ASR Service<br/>(gRPC)"]
    App -->|"gRPCBusAdapter"| TTS["TTS Service<br/>(gRPC)"]
```

This topology suits deployments where perception or speech models run on dedicated
GPU hardware, accessed as gRPC services.