---
sidebar_label: Introduction
sidebar_position: 2
---

# Introduction

> **White paper for the R&D community.** This document presents the architecture,
> design decisions, developer experience, wire protocol, and deployment topologies
> of OpenRoIS, an open-source middleware implementing the OMG Robotic Interaction
> Service (RoIS) Framework 2.0. It is written for robotics researchers, HRI engineers,
> and platform integrators evaluating or adopting the RoIS standard.

Controlling robots from software applications has long suffered from a
fragmentation problem. Each robot platform exposes its own hardware-specific API
(`find face`, `wheel control`, `read battery`). Any hardware change forces an
application rewrite, which kills reusability and slows research transfer from
simulation to deployment.

The OMG Robotic Interaction Service (RoIS) Framework addresses this by defining a
**platform-independent model** for human-robot interaction (HRI) at the **symbolic
level**. Instead of raw sensor data and motor commands, applications exchange
structured messages: "a person was detected", "approach the person", "say this
message". All hardware-specific concerns are hidden behind standardized interfaces.

A specification alone does not drive adoption. Researchers and engineers need a
usable implementation: a clean SDK, reference adapters for real robotics ecosystems,
a gateway that bridges the spec's interfaces to the network, and a component library
that demonstrates the full stack working end to end.

**OpenRoIS** is that implementation. It is an open-source, Apache-2.0 licensed
middleware that implements the OMG RoIS Framework 2.0 and lets operator applications
control **physical robots, virtual avatars, and digital agents** over the internet
through a single, paradigm-neutral SDK.

## Contributions

This white paper describes the following contributions:

1. A **paradigm-neutral architecture** for RoIS 2.0 that decouples the engine,
   gateway, and client SDK from any specific middleware through a four-method
   `BusAdapter` contract ([BusAdapter Contract](/docs/White%20Paper/busadapter-contract)).
2. A **single-source-of-truth type pipeline** that authors interfaces as Python
   Pydantic models and generates C# and TypeScript types from a canonical JSON
   Schema, keeping three language stacks consistent without manual synchronization
   ([Interface Type Pipeline](/docs/White%20Paper/type-pipeline)).
3. A **JSON-RPC 2.0 wire protocol** mapping of the five RoIS interfaces over
   WebSocket, with full message examples for every interface operation
   ([Wire Protocol](/docs/White%20Paper/wire-protocol)).
4. Three **client SDKs** (C# for Unity, TypeScript for web, Python for scripting)
   that expose identical behavior regardless of the host paradigm behind the gateway
   ([Developer Experience](/docs/White%20Paper/developer-experience)).
5. Four **deployment topologies** that compose the same layers into physical robots,
   mixed fleets, single-process avatars, and distributed services
   ([Deployment Topologies](/docs/White%20Paper/deployment-topologies)).
6. A **transport strategy** that selects the right transport at each boundary rather
   than forcing one everywhere
   ([Transport Strategy](/docs/White%20Paper/transport-strategy)).

## Target audience

This document is written for:

- **Robotics researchers** evaluating RoIS 2.0 as a standard for HRI scenarios.
- **HRI engineers** building operator applications for robots or avatars.
- **Platform integrators** connecting existing robotics stacks (ROS 2, Unity,
  gRPC services) to a standard interface.
- **Standards participants** interested in how a beta specification translates to a
  working implementation.

## Status

Alpha, pre-1.0, unstable API. Only the interfaces layer (M0) is complete. The
engine, gateway, bus adapters, components, and SDKs are planned or under
construction. The OMG RoIS Framework is at version 2.0-beta2 and may change.