---
sidebar_label: Security
sidebar_position: 9
description: How to secure an OpenRoIS v0.1.0 gateway with a TLS reverse proxy, and when authentication and authorization arrive.
---

# Security

:::info Status
`v0.1.0` keeps access control out of the middleware: the gateway does not authenticate
or authorize connections and serves plain WebSocket. Authentication and authorization
come in a later release, once the RoIS interfaces are validated. See the
[roadmap](../project/roadmap.md).
:::

The RoIS `connect` operation takes no credentials, because the specification assumes a
trusted network. OpenRoIS follows it: a deployment secures the gateway from the outside,
and the gateway makes that easy.

- It listens on `127.0.0.1` by default, and the Docker Compose quickstart publishes its
  port on loopback only. Bound to any other address, it logs a warning.
- Adapters connect on `/adapter`, and service applications on any other path, so a proxy
  can tell them apart.

## Remote Access Through a Reverse Proxy

Keep the gateway on loopback and let a reverse proxy terminate TLS in front of it. With
[Caddy](https://caddyserver.com/), which obtains certificates on its own and proxies
WebSocket connections without extra configuration:

```text
gateway.example.org {
	# Adapters run next to the gateway, so the internet may not register one.
	@adapter path /adapter
	respond @adapter 403

	reverse_proxy 127.0.0.1:8765
}
```

Clients then connect to `wss://gateway.example.org`. To decide who may connect, add
authentication at the proxy (client certificates, or `forward_auth` to your identity
provider) or use a VPN. Any proxy that forwards WebSocket upgrades works the same way.

## Reporting a Vulnerability

Please report security issues privately by email to **info@coarobo.com** with the subject
"OpenRoIS security report", rather than in public issues. See the
[security policy](https://github.com/openrois/openrois/blob/dev/SECURITY.md).
