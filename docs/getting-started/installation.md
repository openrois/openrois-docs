---
sidebar_label: Installation
sidebar_position: 2
description: Install the OpenRoIS packages from source for Python, TypeScript, and C#.
---

# Installation

OpenRoIS is distributed as source during the alpha. Publication to PyPI, npm, NuGet, and
the Unity Package Manager is [planned](../project/roadmap.md). The package names below
are reserved for that purpose.

## Requirements

| Stack | Version |
|-------|---------|
| Python | 3.12 or later |
| Node.js | 22 or later |
| .NET | .NET Standard 2.1 (Unity 6.3 or later) |
| ROS 2 (optional) | Jazzy Jalisco, for ROS 2 based components |

## Python

The Python packages provide the RoIS types, the recursive engine, and the component
framework. Install them into a virtual environment from a clone of the repository.

```bash
git clone https://github.com/openrois/openrois.git
cd openrois
python3 -m venv .venv
source .venv/bin/activate

pip install ./interfaces/python      # openrois-interfaces: RoIS types
pip install ./core                   # openrois-core: Engine, WsServer, WsClient
pip install ./components/core        # openrois-components-core: component decorators
```

Reference components are separate packages, for example
`pip install ./components/kachaka`.

## TypeScript

The TypeScript SDK depends on the generated TypeScript types. Build both, then reference
the SDK from your project.

```bash
(cd interfaces/typescript && npm install && npm run build)
(cd sdk/typescript && npm install && npm run build)
```

```json title="package.json"
{
  "dependencies": {
    "@openrois/sdk": "file:../openrois/sdk/typescript"
  }
}
```

The SDK ships both ESM and CommonJS builds and runs in browsers and in Node.js.

## C#

The generated C# types target .NET Standard 2.1. Reference the project directly:

```xml title="MyApp.csproj"
<ItemGroup>
  <ProjectReference Include="../openrois/interfaces/csharp/src/OpenRoIS.Interfaces/OpenRoIS.Interfaces.csproj" />
</ItemGroup>
```

The C# client SDK for Unity is [in progress](../project/roadmap.md).

## Package Names

| Package | Registry | Contents |
|---------|----------|----------|
| `openrois-interfaces` | PyPI | RoIS types (source of truth) |
| `openrois-core` | PyPI | Recursive engine, WebSocket server and client |
| `openrois-components-core` | PyPI | Component decorators and result helpers |
| `@openrois/interfaces` | npm | Generated TypeScript types with runtime validation |
| `@openrois/sdk` | npm | TypeScript client SDK |
| `OpenRoIS.Interfaces` | NuGet | Generated C# types |
| `org.openrois.sdk` | UPM | C# client SDK for Unity |
