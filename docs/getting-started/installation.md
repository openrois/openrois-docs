---
sidebar_label: Installation
sidebar_position: 2
description: Install the OpenRoIS client SDKs for JavaScript, Python and Unity, and the gateway and component packages.
---

# Installation

OpenRoIS publishes alpha packages to npm and PyPI, and the Unity package installs by Git
URL. Every package is **Alpha, pre-1.0, unstable API**.

## Requirements

| Stack | Version |
|-------|---------|
| JavaScript | Node.js 22.12 or later, or a browser with a global `WebSocket` |
| Python | 3.12 or later |
| Unity | 6000.0 or later |
| ROS 2 (optional) | Jazzy Jalisco, for ROS 2 based components |

## Client SDKs

A service application uses one of the three client SDKs. They have the same surface, with
one method per operation of the RoIS method catalog.

### JavaScript

```bash
npm install @openrois/sdk
```

`@openrois/sdk` is one ES module build, written in TypeScript with its types included, for
browsers and Node.js. `require` loads it from Node.js 22.12.

### Python

```bash
pip install openrois-sdk
```

`openrois-sdk` is an asyncio client in the `openrois.sdk` module.

### Unity

Add the package by Git URL in the Package Manager window (**Install package from git URL**),
or in `Packages/manifest.json`:

```json title="Packages/manifest.json"
{
  "dependencies": {
    "org.openrois.sdk": "https://github.com/openrois/openrois.git?path=sdk/unity#sdk-unity-v0.1.0-alpha.1"
  }
}
```

The [GitHub release](https://github.com/openrois/openrois/releases/tag/sdk-unity-v0.1.0-alpha.1)
also carries the package as a tarball, for **Install package from tarball**. It is not
signed, so Unity 6000.3 and later note that in the Package Manager.

## Gateway and Components

The gateway and the component SDK are Python packages:

```bash
pip install openrois-gateway          # the gateway process
pip install openrois-components-core  # the SDK for writing components and adapters
```

To try a client without a robot, run the gateway with the mock adapter from a clone of the
repository, as the [quick start](quickstart.md) shows.

## Packages

| Package | Registry | Contents |
|---------|----------|----------|
| `@openrois/sdk` | npm | JavaScript client SDK |
| `openrois-sdk` | PyPI | Python client SDK |
| `org.openrois.sdk` | Git URL, release tarball | Unity client SDK, with the RoIS types for C# bundled |
| `openrois-interfaces` | PyPI | RoIS types, the source of truth |
| `@openrois/interfaces` | npm | RoIS types and runtime validators for JavaScript and TypeScript |
| `openrois-engine` | PyPI | The recursive RoIS HRI Engine, WebSocket server and client |
| `openrois-components-core` | PyPI | Component and adapter SDK |
| `openrois-gateway` | PyPI | The gateway process |
