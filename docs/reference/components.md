---
sidebar_label: Components
sidebar_position: 2
description: The 17 basic RoIS HRI Components, how they map to robots and virtual avatars, and what OpenRoIS provides for each today.
---

# Components

RoIS 2.0 defines 17 basic HRI Components. This page shows how each maps to a physical
robot and to a virtual avatar, and what OpenRoIS provides for it today.

## Robots and Virtual Avatars Share Most Components

Perception and speech components run the same models whether their input comes from a
robot camera or a webcam. Of the 17 basic components, **13 keep the same interface and
the same underlying models across paradigms**, differing at most in their input source,
output device, or coordinate system. Only **4** (Reaction, Navigation, Follow, and Move)
need implementations specific to the paradigm. The table is an analysis of the
component definitions, not a measurement of shared code.

| Component | Physical robot | Virtual avatar | Across paradigms |
|-----------|----------------|----------------|------------------|
| Person Detection | Detector on the robot camera | Detector on a webcam or virtual sensor | Identical |
| Person Localization | Depth camera and tracker | World position or webcam depth | Coordinate system differs |
| Person Identification | Face or re-identification model | Same model | Identical |
| Face Detection | Face detector | Same detector | Identical |
| Face Localization | Face mesh | Same face mesh | Identical |
| Sound Detection | Voice activity detection | Same detection | Identical |
| Sound Localization | Microphone array | Microphone array or virtual source | Source differs |
| Speech Recognition | Speech-to-text model | Same model | Identical |
| Gesture Recognition | Pose model | Same model | Identical |
| Speech Synthesis | Text to speech on a speaker | Text to speech with lip sync | Output differs |
| Audio Streaming | Microphone stream | Synthesized audio stream | Source differs |
| Video Streaming | Camera stream | Rendered frames stream | Source differs |
| System Information | Battery, pose, and health | Frame rate and avatar state | State differs |
| Reaction | LEDs or gestures | Animations and expressions | Paradigm-specific |
| Navigation | Navigation stack, for example Nav2 | Navigation mesh | Paradigm-specific |
| Follow | Navigation and tracking | Virtual follow behavior | Paradigm-specific |
| Move | Velocity commands to motors | Avatar transform | Paradigm-specific |

## Status in OpenRoIS

Three things exist per component type:

- The **profile**: the commands, queries, events and parameters of the type, as a constant
  in `openrois.interfaces.components`, generated from the normative XML profiles of
  RoIS 2.0. A component declares the profile of its type, and the engine serves it.
- **Typed messages**: Python, TypeScript and C# models of the type's results, so an event
  such as `person_detected` is a structured message instead of a list of strings. See
  [how the types are generated](../project/type-generation.md).
- **Implementations**: published components that run against a platform.

| Component | Profile | Typed messages | Implementations |
|-----------|---------|----------------|-----------------|
| System Information | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--available">Available</span> | Reachy Mini, mock |
| Person Detection | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--available">Available</span> | Reachy Mini, mock |
| Reaction | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--available">Available</span> | Reachy Mini |
| Navigation | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--available">Available</span> | mock |
| Speech Synthesis | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | Reachy Mini |
| Person Localization | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Person Identification | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Face Detection | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Face Localization | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Sound Detection | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Sound Localization | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Speech Recognition | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Gesture Recognition | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Follow | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Move | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Audio Streaming | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |
| Video Streaming | <span className="status-pill status-pill--available">Available</span> | <span className="status-pill status-pill--planned">Planned</span> | |

The implementations are in two places:

- The [Reachy Mini adapter](https://github.com/openrois/openrois-adapter-reachy-mini), for
  the open-source Pollen Robotics Reachy Mini. It runs on the real robot and in simulation,
  and is the reference for a complete adapter.
- The [mock adapter](https://github.com/openrois/openrois/tree/dev/testing/mock-adapter)
  of the repository, which simulates its components with no robot. The
  [quick start](../getting-started/quickstart.md) runs it.

A component implements the part of its profile that its platform supports. Its own profile
lists exactly that part, which is what an application reads.

## User-Defined Components

RoIS allows components beyond the basic 17, reusing the common messages and the profile
mechanism. OpenRoIS supports them with the same decorators: pass a profile of your own to
`@component` instead of a constant, as
[write components and an adapter](../guides/components-and-adapters.md) shows. Service
applications discover user-defined components through the profile exactly like basic ones.

## Community Components

Adapters for additional platforms live in their own repositories, separate from the core
repository. A registry for them is part of the long-term [roadmap](../project/roadmap.md).
