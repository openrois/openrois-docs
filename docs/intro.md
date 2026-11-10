---
slug: /intro
sidebar_label: Introduction
sidebar_position: 1
description: OpenRoIS is a community-driven open-source middleware implementing the OMG Robotic Interaction Service (RoIS) Framework 2.0 for physical robots, virtual avatars, and AI services.
---

import ThemedImage from '@theme/ThemedImage';

# Introduction

OpenRoIS is a community-driven open-source middleware that implements the
[OMG Robotic Interaction Service (RoIS) Framework 2.0](https://www.omg.org/spec/RoIS/2.0).
It lets service applications control physical robots, virtual avatars, and AI services
through the standard RoIS interfaces, on a single machine, across a local network, or
over the internet.

## The Problem

Service applications for human-robot interaction are usually written against the
hardware-specific interface of one platform. A change of hardware forces a rewrite of
the application, which undermines reuse and slows the transfer of research into
practice. The cost grows multiplicatively: integrating N applications with M platforms
means N × M integrations, each built and maintained separately.

<figure className="openrois-figure">
  <ThemedImage alt="Without a standard interface, N applications and M platforms need N times M integrations. With OpenRoIS, they need N plus M." sources={{light: "/img/openrois-concept.svg", dark: "/img/openrois-concept-dark.svg"}} />
  <figcaption>OpenRoIS mediates applications and platforms through the symbolic interfaces of RoIS, so an application is written once and each platform is integrated once.</figcaption>
</figure>

## The Standard

RoIS 2.0, standardized by the Object Management Group (OMG), defines a
platform-independent model for this interaction. Service applications talk to HRI
Engines through five interfaces (System, Command, Query, Event, and Streaming) and
exchange **symbolic** messages such as "a person was detected" or "navigate to the
kitchen", never raw sensor data or motor commands. The specification leaves transport
and implementation technology open.

A specification alone does not drive adoption. Researchers and engineers need a
maintained implementation, usable SDKs, reference adapters, and a network gateway.
OpenRoIS provides them, developed in the open under the Apache License 2.0.

## What OpenRoIS Provides

| Part | What it is |
|------|------------|
| [Gateway](concepts/architecture.md) | The process applications connect to. It presents every robot behind it through the RoIS interfaces, as one engine profile. |
| [Adapters and the component SDK](guides/components-and-adapters.md) | An adapter connects one robot to the gateway. You write its components in Python with `@component`, `@command`, `@query` and `@event`. |
| [Client SDKs](reference/sdks.md) | JavaScript, Python and Unity SDKs with one method per RoIS operation, checked against one conformance list. |
| [Inspector](guides/inspector.md) | A browser application that shows the engines and components behind a gateway and drives them, with every message in view. |
| [MCP server](guides/ai-agents.md) | Gives an AI agent the robots behind a gateway through the Model Context Protocol. |
| [Wire protocol](reference/wire-protocol.md) | The five RoIS interfaces mapped onto JSON-RPC 2.0 over WebSocket, usable from browsers and across the internet. |

Two design choices hold these together. One `Engine` class realizes both the main and the
sub HRI Engine roles of RoIS, so the gateway and every adapter behave alike. And the engine
speaks [one protocol at every hop](concepts/architecture.md#one-protocol-at-every-hop), the
RoIS method catalog, which keeps it independent of ROS 2, gRPC, game engines, or any other
middleware.

## Project Status

OpenRoIS is **alpha software with an unstable API**. Release `v0.1.0` runs end to end: a
real Reachy Mini and a simulated one behind one gateway, driven by an application and by
an AI agent. The gateway does not authenticate connections yet, no virtual avatar adapter
exists yet, and media streaming is not carried yet. The [roadmap](project/roadmap.md)
lists what comes next, in order.

## Where to Go Next

- **Try it:** the [quick start](getting-started/quickstart.md) runs a gateway, a mock
  adapter and the Inspector with Docker in a few minutes.
- **Build with it:** write a [service application](guides/service-application.md), connect
  an [AI agent](guides/ai-agents.md), or write the
  [components and adapter](guides/components-and-adapters.md) for your robot.
- **Understand it:** read [RoIS in brief](concepts/rois-overview.md) and the
  [architecture](concepts/architecture.md).
