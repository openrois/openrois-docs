---
sidebar_label: Transports and Media
sidebar_position: 7
description: Why OpenRoIS uses one control-plane transport, lets adapters choose their own, and keeps media on a separate data plane.
---

# Transports and Media

RoIS separates messages from transport. OpenRoIS takes that separation literally: one
transport for the control plane, whatever each platform needs behind the adapters, and a
separate data plane for media.

## One Control Plane

| Boundary | Transport | Why |
|----------|-----------|-----|
| Application to gateway | WebSocket with TLS, JSON-RPC 2.0 | Works through firewalls and NAT, native in browsers, supports asynchronous notifications |
| Gateway to adapter | WebSocket with TLS, JSON-RPC 2.0 | One protocol for every adapter, so the gateway stays paradigm-neutral |
| Adapter to platform | Chosen by the adapter | ROS 2 and DDS, gRPC, IPC, HTTP, or anything else the platform requires |

JSON-RPC 2.0 gives the control plane request and response correlation, a standard error
object, and notifications for events that the engine pushes to applications. The full
mapping is in the [wire protocol reference](../reference/wire-protocol.md).

## Media on a Separate Data Plane

RoIS 2.0 standardizes stream **control** through the Streaming Interface, but leaves
media encoding and transport to implementations. In OpenRoIS, the engine never touches
media: it has no media or WebRTC dependencies and opens no media ports. Audio and video
flow directly between the source and the consumer over WebRTC.

| RoIS stream control | WebRTC counterpart |
|---------------------|--------------------|
| `set_parameter` for encoding and transport | SDP offer |
| `connect_stream` and its results | Peer connection established, SDP answer or media URL |
| `notify_stream_status` | Connection state changes |
| `suspend_stream`, `resume_stream` | Track disabled or enabled |
| `disconnect_stream` | Peer connection closed |

Keeping media off the control plane lets the gateway scale like any other WebSocket
service. Peer-to-peer WebRTC is sufficient for a handful of robots, and a selective
forwarding unit can serve larger fleets without any change to the RoIS interface.

:::note Status
The control plane is available: the engine routes every `rois.stream.*` operation to the
streaming component and its `notify_stream_status` events back to the application, and
the SDKs expose them. WebRTC media on the data plane is
[planned](../project/roadmap.md): today the mock adapter's `VideoStreaming` answers a
placeholder `media_url` and no reference component moves real media yet.
:::

## Commands Versus Streams

The specification keeps two things apart that are easy to conflate. **Speech Synthesis**
is a command component: the robot speaks text through its own speaker. **Audio Streaming**
and **Video Streaming** are stream-control components: live media travels between the
robot and a remote operator.
