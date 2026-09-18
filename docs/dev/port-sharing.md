<!--
SPDX-FileCopyrightText: (C) 2026 Rimora Studio
SPDX-License-Identifier: MIT
-->

# Aether Port Share — implementation plan

Forward `localhost` TCP ports between peers. A dev server running on PC A's
`localhost:3000` becomes reachable at `localhost:3000` on connected PC B.

```
PC A (server)                          PC B (client)
localhost:3000 (dev server)            localhost:3000 → tunnel → A:3000
```

Think VS Code port forwarding / `ssh -L`, but LAN-native and part of the
distributed workspace.

## Goals

- v1: forward a configured list of TCP ports, localhost-only both ends, over
  the existing TLS-encrypted link (inherits fingerprint trust).
- Later: per-share permission prompts, UDP, named shares, session multiplexing.

## Wire design (v1)

No new listen ports, no new protocol version. A forward is a normal Aether
TCP+TLS connection on port 24800 that, after the standard hello exchange,
sends a new top-level message instead of input traffic:

```
Client → Server:  hello-back (protocol, version, name)     [existing]
Client → Server:  FWD<port:uint16>                         [new kMsgForward]
Server → Client:  FWDOK | FWDERR<reason>                   [new kMsgForwardAck/Err]
Then: raw bidirectional byte pump to 127.0.0.1:<port> on the server side
```

Server-side dispatch: `ClientProxyUnknown` completes the handshake and hands
the socket to the versioned `ClientProxy`. The first post-hello message is
inspected — if it is `kMsgForward`, the connection is routed to a
`PortForwardSession` instead of the input/screen flow. Old servers simply
reject the unknown message; old clients never send it.

This keeps `ClientListener`, the hello exchange, TLS upgrade, and fingerprint
verification untouched.

## Components

### `src/lib/aether` — protocol
- `ProtocolTypes.h/.cpp`: `kMsgForward`, `kMsgForwardAck`, `kMsgForwardErr`
  + `ProtocolUtil` read/write helpers.
- `PortForwardPump.{h,cpp}`: bidirectional relay between two `IDataSocket`s
  on the event queue. Half-close semantics: one side closes → finish pending
  writes → close the other.

### `src/lib/server` — `PortForwardSession.{h,cpp}`
- Receives the post-hello socket + requested port.
- Validates against `server/sharedPorts` whitelist (empty = sharing off).
- Dials `127.0.0.1:<port>` via `ISocketFactory` (plaintext — it is loopback).
- Runs `PortForwardPump`; logs open/close at INFO.

### `src/lib/client` — `PortShareListener.{h,cpp}`
- For each configured port P (from `client/forwardPorts`):
  bind `127.0.0.1:P` with `IListenSocket`.
- On accept: open a new `IDataSocket` (TLS) to `server:24800`, do the normal
  hello + `kMsgForward(P)`, then pump.
- Bind failure (port in use): WARN log, continue with other ports.
- Listeners live only while the client session is connected; torn down on
  disconnect.

### Config & GUI
- Settings keys: `server/sharedPorts` (string list, e.g. `3000,5173`),
  `client/forwardPorts` (same format, or `Auto` to mirror server's list later).
- `ServerConfigDialog`: "Share localhost ports" field (comma list) + hint.
- `ClientConfigDialog`: "Tunnel server localhost ports" field.
- Status bar (later): indicator when a forward is active.

## Security model (v1)

- Forwarding is opt-in on the server (`sharedPorts` empty by default → all
  `FWD` requests refused with `FWDERR`).
- Both ends bind `127.0.0.1` only — nothing is exposed on the LAN.
- TLS + fingerprint trust: only verified peers can open forwards.
- Rate-limit/guard: cap concurrent forwards per peer (e.g. 32) to prevent
  fd exhaustion.
- `FWDERR` reasons: `denied`, `port-not-shared`, `dial-failed`, `limit`.

## Testing

- `unittests/aether/PortForwardPumpTests.cpp`: loopback sockets, verify
  byte-for-byte relay both directions + clean close.
- Manual: `node -e "http server"` on A :3000 → B `curl localhost:3000`.
- Two-machine: dev server (vite/next) on A, browser on B hits
  `localhost:3000` — HMR websockets must work (they are just TCP).

## Milestones

1. **Protocol + pump** — messages, `PortForwardPump`, unit tests.
2. **Server side** — post-hello `FWD` dispatch, whitelist check, dial.
3. **Client side** — `PortShareListener`, reconnect lifecycle.
4. **Config/GUI** — settings keys + dialog fields + changelog.
5. **Dogfood** — vite/next dev server across two machines incl. websockets.

## Post-v1 ideas

- Server advertises `sharedPorts` in the session; client shows
  "Available shared ports" with one-click enable (no manual port typing).
- Allow/deny prompt on the server when a peer first requests a port.
- Named shares (`my-app:3000`) surfaced in the workspace UI.
- Channel multiplexing inside the input session (single connection).
- UDP forwarding.
