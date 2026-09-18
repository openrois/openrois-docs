---
sidebar_label: Design Principles
sidebar_position: 3
description: The principles that guide how OpenRoIS turns the RoIS 2.0 specification into software.
---

# Design Principles

RoIS 2.0 deliberately leaves transport and implementation open. OpenRoIS fills these gaps
with explicit choices, guided by the principles below.

## Paradigm Neutrality

ROS 2, DDS, gRPC, and game engines stay out of the core engine and the client SDKs. All
paradigm-specific code lives in adapters and their components. Adding support for a new
kind of platform is therefore an additional adapter, never a change to the core.

The engine depends only on the five-method [Component Contract](component-contract.md),
which makes accidental coupling structurally difficult: there is simply no place in the
engine to put a DDS quality-of-service setting or a game-engine call.

## Specification Traceability

Every external interface and data type traces back to the normative machine-readable
artifacts of RoIS 2.0: the IDL files, the XML component profiles, and the
`XML-Profiles.xsd` schema. Tests cross-check the OpenRoIS type models against these
files. Where the normative files disagree with each other, the XML component profile
wins, and the divergence is documented.

## Transport Separation

The control plane has one uniform carrier: JSON-RPC 2.0 over WebSocket, at every
middleware boundary. Each adapter selects the protocol its own platform requires, and the
gateway never knows or cares which one it is. Media is kept out of the control plane
entirely. See [transports and media](transports-and-media.md).

## Client Consistency

The same SDK calls address physical robots, virtual avatars, and remote services. An
application discovers what is available from the engine profile instead of hardcoding
component names, so it keeps working when the platforms behind the gateway change.

## Symbolic Data Only

Messages carry symbolic results such as a count of detected people or a reached target,
never image buffers or audio frames. This keeps the control plane small and structured,
which is what makes a browser-friendly text protocol practical.

## Package Management Is Not Engine Logic

The engine routes calls, aggregates profiles, and tracks reservations. It never installs
packages or manages component dependencies. Loading components is the adapter's job,
which keeps the engine small, reusable, and testable in isolation.
