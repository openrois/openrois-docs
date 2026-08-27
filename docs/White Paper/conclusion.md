---
sidebar_label: Conclusion
sidebar_position: 18
---

# Conclusion

OpenRoIS demonstrates that the OMG RoIS Framework 2.0 can be implemented as a
practical, paradigm-neutral middleware with clean developer experience. The key
insight is that the spec's separation of message from transport enables a single
`Component Contract` to decouple the engine from ROS 2, virtual avatars, AI
services, and any future paradigm. Adding a new paradigm is an additive adapter,
never a rewrite.

The recursive engine model uses one `Engine` class for both the gateway and
adapters, eliminating duplicate dispatch implementations across languages. The
single-source-of-truth type pipeline (Python Pydantic to JSON Schema to C# and
TypeScript) keeps three language stacks consistent without manual
synchronization. The JSON-RPC 2.0 wire protocol over WebSocket provides a
browser-native, NAT-friendly control plane with full async event support. The
three SDKs (TypeScript for web, C# for Unity, Python for scripting) expose
identical behavior regardless of the host paradigm behind the
gateway.

The project is in alpha. The type pipeline, engine, adapter framework, reference
components, and client SDKs are built and working. The recursive core refactor
(migration to Python `openrois_core`) is the next phase. Researchers and engineers
evaluating RoIS 2.0 can use OpenRoIS as a reference implementation, contribute
reference components, or build applications against the SDK today.

## 18.1 Getting involved

- **Repository**: [github.com/openrois/openrois](https://github.com/openrois/openrois)
- **License**: Apache-2.0
- **Specification**: [OMG RoIS Framework 2.0](https://www.omg.org/spec/RoIS/2.0/Beta2)
- **Roadmap**: [roadmap.md](https://github.com/openrois/openrois/blob/main/docs/roadmap.md)
- **Architecture**: [architecture.md](https://github.com/openrois/openrois/blob/main/docs/architecture.md)
- **Specification reference**: [rois-reference.md](https://github.com/openrois/openrois/blob/main/docs/rois-reference.md)

Contributions are welcome. The phase roadmap defines clear, parallelizable work
items. Reference components are the natural entry point for new contributors.

---

*OpenRoIS is an open-source middleware for the OMG RoIS Framework 2.0. Control
robots, avatars, and digital agents from one paradigm-neutral SDK. Apache-2.0.
Alpha, pre-1.0, unstable API.*