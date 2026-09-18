---
sidebar_label: Roadmap
sidebar_position: 1
description: The phased roadmap of OpenRoIS, from the interface types to version 1.0 and the component registry.
---

# Roadmap

OpenRoIS is built in phases. Each phase delivers a coherent capability with explicit exit
criteria. Until version 1.0, releases are **alpha, with an unstable API**.

## Overview

| Phase | Theme | Status |
|-------|-------|--------|
| 0 | Paradigm-neutral interface types | <span className="status-pill status-pill--available">Done</span> |
| 1 | Engine and sub HRI Engine proof of concept | <span className="status-pill status-pill--available">Done</span> |
| 2 | Adapter framework and reference components | <span className="status-pill status-pill--available">Done</span> |
| 3 | Client SDKs and first end-to-end demonstration | <span className="status-pill status-pill--progress">In Progress</span> |
| 4 | Recursive core in Python | <span className="status-pill status-pill--available">Done</span> |
| 5 | Hardening the core | <span className="status-pill status-pill--planned">Planned</span> |
| 6 | Gateway process | <span className="status-pill status-pill--progress">In Progress</span> |
| 7 | Adapter process | <span className="status-pill status-pill--planned">Planned</span> |
| 8 | Open reference platform and mixed paradigms | <span className="status-pill status-pill--planned">Planned</span> |
| 9 | Authentication, security, and media | <span className="status-pill status-pill--progress">In Progress</span> |
| 10 | Full component library (v1.0) | <span className="status-pill status-pill--planned">Planned</span> |
| 11 | Component registry and Hub | <span className="status-pill status-pill--planned">After 1.0</span> |

Phase 3 continues alongside phases 5 and 6. Phases 8 and 9 can proceed in parallel once the gateway and adapter processes exist.

## Phase Details

### Phase 0: Paradigm-Neutral Interface Types

RoIS types authored as Python models, exported to JSON Schema, and generated into
TypeScript and C#, with tests against the normative RoIS files. Definition of the
five-method Component Contract.

### Phase 1: Engine and Sub HRI Engine Proof of Concept

A TypeScript engine that routes RoIS calls to sub HRI Engines over WebSocket, aggregates their
profiles, tracks reservations, and broadcasts profile changes.

### Phase 2: Adapter Framework and Reference Components

The decorator-based component framework, component-owned backend connections, and
reference Navigation and System Information components for the Preferred Robotics Kachaka
with gRPC and ROS 2 backends.

### Phase 3: Client SDKs and First End-to-End Demonstration

- **Done:** the TypeScript SDK, the profile-driven web client, the mock engine, and an
  end-to-end demonstration of a web application controlling a physical robot through the
  gateway and an adapter.
- **In progress:** the C# client SDK for Unity.
- **Exit:** tagged release `v0.1.0`.

### Phase 4: Recursive Core in Python

The `openrois-core` package: the recursive `Engine`, the component registry and the child
engine proxy implementing the typed Component Contract, the WebSocket server and client,
every Command, Query, and Event operation except streaming, command completion and error
notifications, and a regression test suite with a gateway plus adapter round trip. The
TypeScript proof of concept is retired.

### Phase 5: Hardening the Core

- **Done:** control-plane [latency benchmarks](../reference/benchmarks.md).
- **Planned:** graceful shutdown, reconnection behavior, loading component packages from a
  local path or a Git URL, and minimal health and status endpoints.

### Phase 6: Gateway Process

- **Done:** the `openrois-gateway` process and its container image, composed from `Engine`
  and `WsServer`, with command-line configuration, logging, signal handling, and
  `docker compose up`.
- **In progress:** configuration files and health endpoints.

### Phase 7: Adapter Process

A standalone adapter process composed from `Engine`, `WsClient`, and a backend bridge,
configured by the adapter profile.

### Phase 8: Open Reference Platform and Mixed Paradigms

A reference platform based on the open-source Pollen Robotics Reachy Mini, shipped with
OpenRoIS so anyone can try the full stack on affordable hardware. A demonstration of a
physical robot and a virtual agent behind one gateway, controlled by one application that
does not know which is which. Completing this phase starts the transfer of OpenRoIS to a
neutral open-source foundation.

### Phase 9: Authentication, Security, and Media

- **Done:** JWT authentication at the WebSocket upgrade, role-based authorization per RoIS
  operation with scopes, and TLS at the gateway.
- **Planned:** the RoIS Streaming Interface with WebRTC media, and DDS Security for ROS 2
  based adapters.
See [security](../concepts/security.md) and [transports and media](../concepts/transports-and-media.md).

### Phase 10: Full Component Library

All 17 basic RoIS HRI Components, for physical robots and virtual avatars, and packages
published to PyPI, npm, NuGet, and the Unity Package Manager. First stable release with
semantic versioning guarantees: **v1.0**.

### Phase 11: Component Registry and Hub

A registry of community components and adapters for additional platforms, and a Hub web
application that visualizes connected adapters, components, and their status. This phase
is gated on adoption and follows version 1.0.

## Versioning

- `0.x` releases are pre-releases. Breaking changes may happen without notice.
- `1.0` is the first release with semantic versioning guarantees.

## Contributing to the Roadmap

Many items above can be picked up in parallel, and reference components for new robots
are the natural entry point. See [contributing](contributing.md), or open an issue to
propose a change to the roadmap.
