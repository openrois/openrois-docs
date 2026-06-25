---
sidebar_label: Layered Architecture
sidebar_position: 5
---

# Layered Architecture

OpenRoIS is organized in four layers. The client SDK and gateway are constant across
all deployments. Only the BusAdapter and host layout change.

```mermaid
flowchart TB
    subgraph L1["Layer 1: Client"]
        direction LR
        WebApp["Web Operator App<br/>+ RoIS TS SDK"]
        UnityApp["Unity Operator App<br/>+ RoIS C# SDK"]
        PyScript["Python Script<br/>+ RoIS Py SDK"]
    end

    subgraph L2["Layer 2: Gateway (Main HRI Engine)"]
        direction LR
        Auth["Auth Module<br/>JWT / RBAC"]
        Session["Session Manager"]
        WSServer["WebSocket Server<br/>JSON-RPC 2.0"]
        RoISAdapter["RoIS Interface Adapter<br/>SystemIF, CommandIF, QueryIF, EventIF"]
        WebRTCBridge["WebRTC Signaling<br/>+ Media Bridge"]
    end

    subgraph L3["Layer 3: Internal Bus (Pluggable)"]
        direction LR
        BusAdapter["BusAdapter Contract<br/>discover, invoke, query, subscribe"]
    end

    subgraph L4["Layer 4: Hosts (Sub-Engines and Components)"]
        direction LR
        Robot["ROS 2 / DDS<br/>Physical Robot<br/>(Nav2, YOLO, perception)"]
        Avatar["InProcess<br/>Virtual Avatar<br/>(Unity, Godot, Web)"]
        Services["gRPC<br/>Distributed AI Services<br/>(perception, ASR, TTS)"]
    end

    L1 -->|"WebSocket / TLS<br/>(RoIS control plane)"| L2
    L1 -.->|"WebRTC (SRTP/DTLS)<br/>(media data plane)"| L2
    L2 -->|"BusAdapter interface"| L3
    L3 --> Robot
    L3 --> Avatar
    L3 --> Services
```

The spec's "main HRI Engine" maps to the **Gateway** (Layer 2). Each "sub HRI Engine"
maps to a **per-host node** (Layer 4): a robot node, an avatar process, or a service.
"HRI Components" map to whatever the chosen BusAdapter addresses: in-process objects,
gRPC services, or ROS 2 component nodes. The client only ever talks to the gateway.
The host topology and paradigm are hidden, exactly as the specification requires.

## Mapping RoIS concepts to OpenRoIS layers

| RoIS concept | OpenRoIS implementation | Layer |
|-------------|------------------------|-------|
| Main HRI Engine | Gateway (Python, asyncio) | 2 |
| Sub HRI Engine | Per-host node (robot node, avatar process, service) | 4 |
| HRI Component | In-process object, gRPC service, or ROS 2 node | 4 |
| Service Application | Client SDK (C#, TypeScript, or Python) | 1 |
| RoIS interfaces (SystemIF, CommandIF, QueryIF, EventIF, Streaming) | JSON-RPC 2.0 methods over WebSocket | 1 to 2 |
| Transport (unspecified by RoIS) | BusAdapter contract + concrete adapters | 3 |

## Gateway responsibilities

The gateway is the only internet-facing process and the single enforcement point for
security. It:

- Terminates the remote transport (WebSocket/TLS) and authenticates every connection
  before any RoIS message is processed.
- Translates JSON-RPC RoIS calls to bus adapter operations (service/action/topic for
  ROS 2, method calls for in-process, gRPC for distributed services).
- Aggregates profiles from all authorized sub-engines into one `HRI_Engine_Profile`
  returned by `get_profile()`.
- Filters `search()` and `query()` results and guards `bind()` and `execute()` per
  the caller's authorization scope.
- Relays WebRTC signaling (SDP/ICE) over the same WebSocket connection and bridges
  media through an SFU when needed.