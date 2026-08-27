---
sidebar_label: Hub and Marketplace
sidebar_position: 16
---

# Long-Term Vision: Hub and Marketplace

The Hub and component marketplace are long-term, post-1.0 goals. They build on the
package management mechanism from Phase 5, not on a monolithic engine. They are
parked until the core is solid and has real adoption.

## 16.1 Hub

The Hub is a management web app that connects to the gateway `Api` over WebSocket
and REST. It visualizes adapters, components, status, and fleet health. It is a
consumer of the gateway's management surface, not part of the engine. A
richer commercial Hub (audit trail, OTA, compliance) can be built on top of the open
gateway `Api` later.

## 16.2 Component marketplace

The component marketplace is a registry of certified components. Component vendors
publish to the registry. Adapters deploy packages through the gateway `Api` or
directly. The marketplace is a different source for the adapter's package loader and
a different backend for the gateway `Api`, not new engine logic.

## 16.3 Gating principle

The core must be solid and have real adoption before the Hub and marketplace are
built. They are features on top of the management `Api`, not prerequisites.