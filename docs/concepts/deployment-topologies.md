---
sidebar_label: Deployment Topologies
sidebar_position: 8
description: How the same OpenRoIS processes deploy on one machine, across a local network, over the internet, or with cloud perception.
---

# Deployment Topologies

The control plane is uniform, so deployments of very different scales differ mainly in
**where the processes run**. The application, the gateway, and the adapters are the same
software in every case.

## Single Host

Everything runs on one machine: the application, the gateway, and the adapter. This is the
development setup, and it also suits a robot whose onboard computer runs the whole stack.

```mermaid
flowchart LR
    subgraph Host["One machine"]
        App["Service Application"] -->|WebSocket| GW["Gateway"]
        GW -->|WebSocket| AD["Adapter"]
        AD --> R["Robot"]
    end
```

## Local Network

A gateway on the network serves several robots, each with its own adapter, and presents
one aggregated profile to the application.

```mermaid
flowchart LR
    App["Service Application"] -->|WebSocket| GW["Gateway"]
    GW -->|WebSocket| A1["Adapter"] --> R1["Robot 1"]
    GW -->|WebSocket| A2["Adapter"] --> R2["Robot 2"]
```

## Across the Internet

The operator application, the gateway, and each robot may be in three different places, as
in teleoperation. WebSocket connections are outbound from the adapters, so robots behind a
firewall can join a gateway in the cloud.

```mermaid
flowchart LR
    App["Operator application<br/>(remote)"] -->|WebSocket, TLS| GW
    subgraph Cloud["Cloud or edge"]
        GW["Gateway"]
    end
    GW -->|WebSocket, TLS| A1["Adapter"] --> R1["Robot at site A"]
    GW -->|WebSocket, TLS| A2["Adapter"] --> R2["Robot at site B"]
```

## Cloud Perception

Components that need more compute than a robot carries, such as speech recognition or
large perception models, run in a separate adapter next to the compute, or as local
components of the gateway. The application cannot tell the difference: `search` returns
every component, and `bind` and `execute` behave identically wherever the component runs.

```mermaid
flowchart LR
    App["Service Application"] -->|WebSocket| GW["Gateway"]
    GW -->|WebSocket| PA["Perception adapter<br/>GPU host"] --> M["Models"]
    GW -->|WebSocket| RA["Robot adapter"] --> R["Robot"]
```

## Physical Robots and Virtual Agents Together

The same architecture serves virtual agents. An avatar rendered in a game engine gets its
own adapter, and the application addresses it with the same calls it uses for a physical
robot.

[`examples/mixed-paradigm`](https://github.com/openrois/openrois/tree/dev/examples/mixed-paradigm)
shows it: one script starts a gateway, connects the mock robot adapter and the
[avatar adapter](https://github.com/openrois/openrois/tree/dev/examples/avatar-adapter)
(a text-based virtual agent with `SpeechSynthesis` and `Reaction`), then plays an
application that discovers both, queries both positions, and makes both say the same
sentence with identical `set_parameter` and `execute` calls, waiting for both
`rois.command.completed`. The application's code addresses components by ref only. Both
sides are simulated so the demonstration runs on any laptop; the same script runs against
real adapters.
