---
sidebar_label: SDKs
sidebar_position: 3
description: The OpenRoIS client SDKs for JavaScript, Python and Unity, and the component SDK for Python, and how their APIs map to the RoIS interfaces.
---

# SDKs

| SDK | For | Package | Status |
|-----|-----|---------|--------|
| JavaScript | Browsers and Node.js service applications | `@openrois/sdk` | <span className="status-pill status-pill--progress">Alpha</span> |
| Python | Asyncio service applications and AI services | `openrois-sdk` | <span className="status-pill status-pill--progress">Alpha</span> |
| Unity | Desktop, mobile and VR headset applications | `org.openrois.sdk` | <span className="status-pill status-pill--progress">Alpha</span> |
| Component SDK (Python) | Components and adapters | `openrois-components-core` | <span className="status-pill status-pill--progress">Alpha</span> |

The three client SDKs share one surface and one [conformance list](https://github.com/openrois/openrois/blob/dev/testing/conformance/README.md),
which each passes against the same gateway and engine versions. They share the RoIS types of
the [generated types](../project/type-generation.md), so a message has the same fields in
every language. See [installation](../getting-started/installation.md) to add one to a
project.

## The Client Surface

`RoISClient` has one method per operation of the RoIS method catalog. Each takes the
operation's IDL parameters in IDL order and returns its out parameters. A result whose
return code is not `OK` raises `RoISError`, which carries the return code.

| RoIS interface | JavaScript | Python | Unity |
|----------------|------------|--------|-------|
| System | `RoISClient.connect()`, `disconnect()`, `getProfile()`, `getErrorDetail()` | `RoISClient.connect()`, `disconnect()`, `get_profile()`, `get_error_detail()` | `RoISClient.ConnectAsync()`, `DisconnectAsync()`, `GetProfileAsync()`, `GetErrorDetailAsync()` |
| Command | `search()`, `bind()`, `bindAny()`, `release()`, `getParameter()`, `setParameter()`, `execute()`, `getCommandResult()` | `search()`, `bind()`, `bind_any()`, `release()`, `get_parameter()`, `set_parameter()`, `execute()`, `get_command_result()` | `SearchAsync()`, `BindAsync()`, `BindAnyAsync()`, `ReleaseAsync()`, `GetParameterAsync()`, `SetParameterAsync()`, `ExecuteAsync()`, `GetCommandResultAsync()` |
| Query | `query()` | `query()` | `QueryAsync()` |
| Event | `subscribe()`, `unsubscribe()`, `getEventDetail()` | `subscribe()`, `unsubscribe()`, `get_event_detail()` | `SubscribeAsync()`, `UnsubscribeAsync()`, `GetEventDetailAsync()` |

Every client listens with `on(name, listener)` and `off(name, listener)`, `On` and `Off` in
Unity, for the four notifications of the catalog, and for `close` and `error`:

| Name | Received |
|------|----------|
| `rois.event.notify_event` | Every event of every subscription |
| `rois.command.completed` | The status of a command that ended |
| `rois.system.notify_error` | An error the engine reports |
| `rois.system.profile_changed` | Components that joined or left |
| `close` | The close code and reason, from either side |
| `error` | A message that cannot be used, or a listener that failed |

Conditions are strings in the OpenRoIS subset of CQL2-Text, and each SDK has builders for
them: `componentRef`, `componentType`, `like` and `allOf` in JavaScript, with the same
names in snake case in Python and in Pascal case on `Condition` in Unity.

RoIS has no operation that waits for a command, so no SDK has one either. Add the
`rois.command.completed` listener before `execute`, record each status by command id, and
wait for it before `release`, which aborts a running command. The
[service application guide](../guides/service-application.md) shows this.

## Per Language

| SDK | Notes | Full reference |
|-----|-------|----------------|
| JavaScript | One ES module build. Uses the global `WebSocket`, or a `webSocketFactory`. `await using` disconnects at the end of a block | [README](https://github.com/openrois/openrois/blob/dev/sdk/javascript/README.md) |
| Python | `connect()` works with `await` and with `async with`. A plain listener runs in the reader, and a coroutine in a task of its own | [README](https://github.com/openrois/openrois/blob/dev/sdk/python/README.md) |
| Unity | Listeners run on the main thread. Clients end when Play Mode ends, also with domain reload off. Run in Linux players with IL2CPP and Mono, and in the Editor. The Android build has not run on a device, and iOS has not been built | [README](https://github.com/openrois/openrois/blob/dev/sdk/unity/README.md) |

None of the SDKs has been run over `wss://`, and the gateway does not authenticate
connections in the alpha, so use it on trusted networks only.

## Component SDK

The Python packages that run next to a platform are separate from the client SDKs.

| Package | Purpose |
|---------|---------|
| `openrois-components-core` | Write components: `@component(profile)`, `@command`, `@query`, `@event`, resources and status |
| `openrois-engine` | The recursive engine that hosts components in an adapter or a gateway |
| `openrois-gateway` | The gateway process |
| `openrois-interfaces` | RoIS types, the source of truth |

See [write components and adapters](../guides/components-and-adapters.md) for a
walkthrough.
