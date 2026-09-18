---
sidebar_label: Related Work
sidebar_position: 2
description: How OpenRoIS relates to ROS 2, Open-RMF, RT-Middleware, RSNP, and the RoIS specification itself.
---

# Related Work

OpenRoIS complements existing robot middleware rather than competing with it. It works at
the level of **human-robot interaction services**, above the middleware that moves data
inside a robot.

## ROS and ROS 2

[ROS](https://www.ros.org/) and ROS 2 are the most widely used middleware in research
robotics. OpenRoIS places ROS 2 behind an adapter: synchronous RoIS operations map to ROS 2
services, long-running operations to actions, and notifications to topics. A service
application then addresses ROS 2 robots, robots built on other middleware, and virtual
agents through the same symbolic interface, without depending on ROS 2 itself.

## Open-RMF

[Open-RMF](https://www.open-rmf.org/) coordinates heterogeneous robot fleets and shared
infrastructure, such as doors and elevators, above the control of individual robots. It
answers how many robots share a building. OpenRoIS answers how an application interacts
with a person through one robot or agent. The two are complementary, and RoIS components
can run on robots coordinated by Open-RMF.

| | Open-RMF | OpenRoIS |
|---|----------|----------|
| Focus | Fleet coordination and traffic management | Human-robot interaction services |
| Question | How do many robots share a space? | How does this robot or agent interact with a person? |
| Standard basis | Open-source convention | OMG RoIS 2.0 |

## RT-Middleware and the OMG Robotic Technology Component

RT-Middleware pioneered component-based robot middleware and led to the OMG
[Robotic Technology Component (RTC)](https://www.omg.org/spec/RTC) specification, which
RoIS references. OpenRoIS builds on that lineage at the service level, where RTC focuses
on component lifecycle and data ports.

## RSNP

The Robot Service Network Protocol (RSNP) defined a web-services protocol for networked
robot services. It shares the goal of reaching robots over networks, which OpenRoIS pursues
with a WebSocket and JSON-RPC 2.0 transport for the RoIS messages.

## The RoIS Specification

RoIS was developed by the Japan Robot Association (JARA) and the Electronics and
Telecommunications Research Institute (ETRI) and standardized by the Object Management
Group. Version 1.0 was published in 2013 and version 2.0 in June 2026. It defines a platform-independent model and leaves the transport
and the implementation open. OpenRoIS does not fork or extend the specification. It is one
concrete, openly developed implementation of it, and it documents every implementation
choice the specification leaves to implementers.
