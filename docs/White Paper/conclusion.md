---
sidebar_label: Related Work and Conclusion
sidebar_position: 16
---

# Related Work and Positioning

## RoIS and other HRI standards

RoIS is not the only standard addressing human-robot interaction. However, it is
unique in defining a **platform-independent model** at the symbolic level, separate
from any transport. Other approaches tend to couple the interface to a specific
middleware (for example, ROS actions, gRPC services, or CORBA operations). RoIS
defines the messages and lets the implementation choose the transport, which is the
property OpenRoIS exploits through the `BusAdapter` contract.

## OpenRoIS and ROS 2

ROS 2 is the dominant research robotics middleware and one of the spec's approved
transports. OpenRoIS does not compete with ROS 2. It uses ROS 2 as the primary robot
bus adapter (`ROS2BusAdapter`). RoIS operations map to ROS 2 primitives: synchronous
operations to services, long-running operations to actions, async push to topics.
The value OpenRoIS adds is a **standardized symbolic interface** above ROS 2, so
that the same operator application can also drive a virtual avatar or a distributed
service without rewriting the scenario logic.

## OpenRoIS and Unity

Unity is the primary client platform for operator applications. The C# SDK targets
Unity via UPM and runs on both Mono (Unity 6.3+) and CoreCLR (Unity 6.8). The same
SDK also works outside Unity (any .NET runtime). The in-process avatar topology
means a Unity application can host the engine, gateway, and avatar components in a
single process, with zero serialization overhead.

## Conformance

An implementation claiming RoIS conformance shall:

- Provide the interfaces described in the RoIS specification section 8.2.
- Support the message data structures described in section 8.3 (RoIS Profiles).
- Support the Common Messages of section 8.4 for the basic components it implements
  (it need not implement every basic component).
- Handle component profiles described as XML files and the messages defined therein.

OpenRoIS targets full conformance. The interface types are cross-checked against the
normative XML profiles and validated against `XML-Profiles.xsd` in CI. A conformance
test suite asserts behavior against the spec's interfaces and profiles, run against
every BusAdapter.

---

# Conclusion

OpenRoIS demonstrates that the OMG RoIS Framework 2.0 can be implemented as a
practical, paradigm-neutral middleware with clean developer experience. The key
insight is that the spec's separation of message from transport enables a single
`BusAdapter` contract to decouple the engine from ROS 2, in-process runtimes, gRPC
services, and any future paradigm. Adding a new paradigm is an additive adapter,
never a rewrite.

The single-source-of-truth type pipeline (Python Pydantic to JSON Schema to C# and
TypeScript) keeps three language stacks consistent without manual synchronization.
The JSON-RPC 2.0 wire protocol over WebSocket provides a browser-native, NAT-friendly
control plane with full async event support. The three SDKs (C# for Unity,
TypeScript for web, Python for scripting) expose identical behavior regardless of the
host paradigm behind the gateway.

The project is in alpha. The interfaces layer is complete. The engine, gateway, bus
adapters, components, and SDKs are under construction. Researchers and engineers
evaluating RoIS 2.0 can use OpenRoIS as a reference implementation, contribute
reference components, or build applications against the SDK today.

## Getting involved

- **Repository**: [github.com/openrois/openrois](https://github.com/openrois/openrois)
- **License**: Apache-2.0
- **Specification**: [OMG RoIS Framework 2.0](https://www.omg.org/spec/RoIS/2.0/Beta2)
- **Roadmap**: [roadmap](https://github.com/openrois/openrois/blob/main/docs/roadmap.md)
- **Architecture**: [architecture](https://github.com/openrois/openrois/blob/main/docs/architecture.md)
- **Specification reference**: [rois-reference](https://github.com/openrois/openrois/blob/main/docs/rois-reference.md)

Contributions are welcome. The milestone roadmap defines clear, parallelizable work
items. Reference components are the natural entry point for new contributors.

---

*OpenRoIS is an open-source middleware for the OMG RoIS Framework 2.0. Control
robots, avatars, and digital agents from one paradigm-neutral SDK. Apache-2.0.
Alpha, pre-1.0, unstable API.*