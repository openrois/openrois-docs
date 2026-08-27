---
sidebar_label: Roadmap and Maturity
sidebar_position: 15
---

# Roadmap and Maturity

OpenRoIS is built in phases. Each phase delivers a coherent architectural shift or
a working end-to-end capability. See the [roadmap](https://github.com/openrois/openrois/blob/main/docs/roadmap.md) for the full phase
details, dependency graph, and open decisions.

| Phase | Theme | Exit tag | Status |
|-------|-------|----------|--------|
| 0 | Paradigm-Neutral Interfaces | type pipeline, `Component Contract` | done |
| 1 | Engine and Sub-engine | TypeScript engine POC, `SubEngine` proxy, mock components | done |
| 2 | Adapter Framework and Components | Python `AdapterFramework`, reference components, real robot adapter | done |
| 3 | Client SDKs and MVP | `v0.1.0` | done |
| 4 | Recursive Core Refactor | one `Engine` class in Python `openrois_core`, eliminate duplicate dispatch | todo |
| 5 | Solidify the Core | harden engine, component framework, package management v0 | todo |
| 6 | Gateway Process | compose `Engine` + `WsServer` from `openrois_core` | todo |
| 7 | Adapter Process | compose `Engine` + `WsClient` from `openrois_core` + backend bridge | todo |
| 8 | Real Component and Mixed Paradigm | paradigm-neutrality proof | todo |
| 9 | Auth, Security, Media | parallelizable after Phase 7 | todo |
| 10 | Full Component Library | `v1.0` | todo |
| 11 | Hub and Component Marketplace | post-1.0, adoption-gated | parked |

The **MVP is Phase 3**: the minimum that lets a service application clone, build,
and control a real robot from a web application over WebSocket. The
**paradigm-neutrality proof is Phase 8** (mixed robot and avatar on one gateway).
The **foundation migration trigger fires after Phase 8, before Phase 10**: the
paradigm-neutrality proof is the governance milestone that initiates migration to a
neutral foundation home. The **1.0 release is Phase 10**.

## 15.1 Versioning

- `v0.1.0` (Phase 3): first pre-release. MVP demonstration. Unstable API, breaking
  changes may occur without notice.
- `v0.x` (Phases 4 to 9): incremental pre-releases. Unstable API.
- `v1.0` (Phase 10): first stable release with semantic versioning guarantees.
  All 17 basic components implemented across both paradigms.
- Phase 11: post-1.0. No version tag until the Hub and marketplace are feature
  complete and adoption-gated.

Pre-1.0 releases are Alpha, unstable API. Do not use in production until v1.0.

## 15.2 Current state

The type pipeline, TypeScript engine POC, Python adapter framework, reference
components, and all three client SDKs are built and working. The MVP demonstration
runs against a real robot via gRPC. The recursive core refactor (Phase 4) is the
next step. It migrates the TypeScript engine POC to a Python `openrois_core`
package with a single recursive `Engine` class, eliminating the duplicate dispatch
implementation.