---
sidebar_label: Introduction
sidebar_position: 1
---

# Introduction

> **White paper for the R&D community.** This document presents the architecture,
> design decisions, developer experience, wire protocol, and deployment topologies
> of OpenRoIS, an open-source middleware implementing the OMG Robotic Interaction
> Service (RoIS) Framework 2.0. It is written for robotics researchers, HRI engineers,
> and platform integrators evaluating or adopting the RoIS standard.
>
> **Companion documents:**
>
> - [architecture.md](https://github.com/openrois/openrois/blob/main/docs/architecture.md) is the engineering design document
>   (how the system is designed, with implementation detail).
> - [rois-reference.md](https://github.com/openrois/openrois/blob/main/docs/rois-reference.md) is the OMG RoIS specification summary
>   and reference (what the specification says).
> - [roadmap.md](https://github.com/openrois/openrois/blob/main/docs/roadmap.md) is the phase roadmap (what is built and in what
>   order).
>
> **Status:** Alpha, pre-1.0, unstable API. The type pipeline, engine, adapter
> framework, reference components, and client SDKs are built and working against
> a real robot. The recursive core refactor (migration to Python `openrois_core`)
> is the next phase. The OMG RoIS
> Framework is at version 2.0-beta2 and may change.

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
usable implementation: a clean SDK, reference adapters for real robotics
ecosystems, a gateway that bridges the spec's interfaces to the network, and a
component library that demonstrates the full stack working end to end.

**OpenRoIS** is that implementation. It is an open-source, Apache-2.0 licensed
middleware that implements the OMG RoIS Framework 2.0 and lets service applications
control **physical robots, virtual avatars, and digital agents** over the internet
through a single, paradigm-neutral SDK.

## 1.1 Contributions

This white paper describes the following contributions:

1. A **paradigm-neutral architecture** for RoIS 2.0 that decouples the engine
   and client SDK from any specific middleware through a five-method
   `Component Contract` (section 6).
2. A **recursive engine model** where one `Engine` class is used by both the
   gateway and adapters, eliminating duplicate dispatch implementations across
   languages (section 4).
3. A **single-source-of-truth type pipeline** that authors interfaces as Python
   Pydantic models and generates C# and TypeScript types from a canonical JSON
   Schema, keeping three language stacks consistent without manual
   synchronization (section 7).
4. A **JSON-RPC 2.0 wire protocol** mapping of the five RoIS interfaces over
   WebSocket, with full message examples for every interface operation
   (section 9).
5. Three **client SDKs** (TypeScript for web, C# for Unity, Python for scripting)
   that expose identical behavior regardless of the host paradigm behind the
   gateway (section 8).
6. A **package management boundary** that keeps the engine pure while
   allowing adapters to load component packages from local or remote sources
   (section 14).

## 1.2 Target audience

This document is written for:

- **Robotics researchers** evaluating RoIS 2.0 as a standard for HRI scenarios.
- **HRI engineers** building service applications for robots or avatars.
- **Platform integrators** connecting existing robotics stacks (ROS 2, Unity,
  gRPC services) to a standard interface.
- **Standards participants** interested in how a beta specification translates to a
  working implementation.