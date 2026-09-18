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

| Contribution | Summary |
|--------------|---------|
| [Recursive engine](concepts/recursive-engine.md) | One `Engine` class realizes both the main and the sub HRI Engine roles of RoIS, so the gateway and every adapter share one dispatch implementation. |
| [Component Contract](concepts/component-contract.md) | A five-method internal contract (`discover`, `invoke`, `query`, `subscribe`, `unsubscribe`) that keeps the engine independent of ROS 2, gRPC, game engines, or any other middleware. |
| [Wire protocol](reference/wire-protocol.md) | A mapping of the five RoIS interfaces onto JSON-RPC 2.0 over WebSocket, usable from browsers and across the internet. |
| [Type pipeline](concepts/type-pipeline.md) | RoIS types authored once as Python models, exported to JSON Schema, and generated into TypeScript and C#. |
| [SDKs](reference/sdks.md) | A TypeScript client SDK for web applications, a C# client SDK for Unity, and a Python adapter SDK (the component framework) with ROS 2 support. |

## Project Status

OpenRoIS is **alpha software with an unstable API**. The interface types, the recursive
engine, the adapter SDK, the TypeScript SDK, and reference components for a
commercial robot are available and have been demonstrated with a physical robot.
Media transport, published packages, and the full component library are
on the [roadmap](project/roadmap.md).

## Where to Go Next

- **Try it:** the [quickstart](getting-started/quickstart.md) runs an engine and a
  browser-based inspector in a few minutes.
- **Understand it:** start with the [RoIS overview](concepts/rois-overview.md) and the
  [architecture](concepts/architecture.md).
- **Build with it:** write a [service application](guides/service-application.md) or a
  [component for your robot](guides/components-and-adapters.md).
