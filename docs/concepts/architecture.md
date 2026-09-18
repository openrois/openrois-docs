---
sidebar_label: Architecture
sidebar_position: 2
description: How OpenRoIS realizes the RoIS engine hierarchy as a gateway, adapters, and components connected by WebSocket and JSON-RPC 2.0.
---

import ThemedImage from '@theme/ThemedImage';

# Architecture

OpenRoIS maps each concept of RoIS 2.0 onto a process or a class you can deploy. The
gateway realizes the main HRI Engine, each adapter realizes a sub HRI Engine, and HRI
Components are classes hosted by adapters.

<figure className="openrois-figure">
  <ThemedImage alt="OpenRoIS architecture: service applications, the gateway hosting the main HRI Engine, adapters hosting sub HRI Engines, and their hosts." sources={{light: "/img/openrois-architecture.svg", dark: "/img/openrois-architecture-dark.svg"}} />
  <figcaption>Every middleware boundary uses WebSocket and JSON-RPC 2.0. Each adapter reaches its host through the transport that host requires, and media stays on a separate data plane.</figcaption>
</figure>

## From RoIS Concepts to OpenRoIS

| RoIS concept | OpenRoIS realization |
|--------------|----------------------|
| Service Application | Your application, built with the TypeScript or C# SDK |
| Main HRI Engine | The **gateway**: an `Engine` with child engines, behind a WebSocket server |
| Sub HRI Engine | An **adapter**: an `Engine` with local components, connected to the gateway |
| HRI Component | A class decorated with `@component`, hosted by an adapter |
| RoIS interfaces | JSON-RPC 2.0 methods in the `rois.*` namespaces |
| Implementation Layer | The robot, avatar, or service behind an adapter, outside OpenRoIS |

## The Layers

### Service Applications

Applications use a client SDK to connect to the gateway over WebSocket. They discover
components from the engine profile, so the same application works with whatever robots,
avatars, and services are connected. See [writing a service application](../guides/service-application.md).

### The Gateway

The gateway is the only process that faces the network. It hosts the main HRI Engine,
which:

- **routes** each RoIS call to the adapter that owns the target component,
- **aggregates** the profiles of all connected adapters into one engine profile,
- **allocates** actuation components between applications through `bind` and `release`,
- **notifies** clients with `rois.system.profile_changed` when an adapter connects or
  leaves, so they refresh their view without polling.

Authentication and authorization at the gateway are [planned](security.md).

### Adapters

An adapter is a standalone process that hosts a sub HRI Engine with the components of one
platform. It connects to the gateway, answers the gateway's discovery request with its
profile, and dispatches incoming calls to its components. Adapters reconnect with
exponential backoff if the gateway restarts. See [writing components and adapters](../guides/components-and-adapters.md).

### Components

A component is the translation layer between RoIS and one platform. It exposes RoIS
queries, commands, and events, and owns its connection to the platform: a ROS 2 node, a
gRPC client, or a cloud API client, created in `connect()` and closed in `disconnect()`.

## Four Contracts at Four Boundaries

| Boundary | Contract | Transport |
|----------|----------|-----------|
| Application to gateway | The five RoIS interfaces | WebSocket, JSON-RPC 2.0 |
| Gateway to adapter | The [Component Contract](component-contract.md) | WebSocket, JSON-RPC 2.0 |
| Adapter to component | Decorated handler methods | In process |
| Component to platform | Whatever the platform requires | ROS 2, gRPC, IPC, HTTP, and others |

Only the first three are middleware boundaries. The last one belongs to the component, and
OpenRoIS deliberately takes no position on it.

## Build Time: One Source of Truth for Types

The types that cross these boundaries are authored once as Python models and generated
into every other language, so the gateway, the adapters, and the SDKs cannot drift apart.
See the [type pipeline](type-pipeline.md).

## Further Reading

- [Design principles](design-principles.md) behind these choices
- [The recursive engine](recursive-engine.md) that implements both engine roles
- [Deployment topologies](deployment-topologies.md) from one laptop to the internet
