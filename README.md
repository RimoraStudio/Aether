# Aether

**Share one keyboard and mouse across multiple computers.**

Aether lets you control several machines on your desk with a single keyboard, mouse, or trackpad. Move your cursor off the edge of one screen and it appears on the next. Copy and paste between systems. All traffic is encrypted with TLS. No hardware, no KVM switch, no cloud account.

Built on the Synergy codebase, Aether is a rebranded and modernized fork maintained by Rimora Studio. It works with Windows and Linux, and stays compatible with Synergy and Barrier peers.

## Why Aether

- **No KVM switch.** Software-only. Just install on each machine and connect over your LAN.
- **No cloud.** Direct peer-to-peer connection. Nothing leaves your network.
- **No subscription.** Free and open source under GPL-2.0 with OpenSSL exception.

## Features

### Input sharing
- One keyboard, mouse, or trackpad controls all machines
- Cursor moves seamlessly across screens by dragging to the edge
- Hotkeys for jumping to a specific screen
- Configurable screen layout with drag-and-drop grid

### Cross-platform
- Windows 10 or later (x64)
- Linux with X11 or Wayland (x64)
- Same protocol works with Synergy and Barrier peers

### Clipboard sharing
- Copy text between machines
- Copy images between machines
- Synchronized clipboard state across all connected systems

### Security
- TLS encrypted network traffic between server and clients
- Fingerprint-based peer verification
- Configurable firewall rules on Windows

### Quality of life
- System tray integration with quick start/stop
- Auto-start on login (optional)
- Version checker with update notification
- Multi-language UI (English, Italian, Spanish, Japanese, Korean, Russian, Chinese)

## Download and install

Prebuilt installers and packages are available on the [releases page](https://github.com/RimoraStudio/Aether/releases).

### Windows

1. Download `aether-<version>-win-x64.msi` (recommended) or the `.exe` bootstrapper.
2. Run the installer. Administrator privileges are required.
3. Launch **Aether** from the Start menu.
4. On the first PC choose **Server**, on the others choose **Client**.
5. Arrange your screens in the GUI to match your physical layout.
6. Start the server.

A portable `.7z` archive is also available if you prefer not to install.

### Linux

- **Debian, Ubuntu, Mint:** download the `.deb` and run `sudo apt install ./aether-*.deb`
- **Fedora, openSUSE:** download the `.rpm` and run `sudo dnf install aether-*.rpm` or `sudo zypper install aether-*.rpm`
- **Other distributions:** extract the `.tar.gz` archive and run the binary directly

On Linux, Aether supports both X11 and Wayland. The correct backend is selected automatically based on your session type.

## Getting started

After installing, you need to set up at least two machines:

1. Pick one machine as the **server** (the one with the keyboard and mouse you want to share).
2. Install Aether on the other machines and set them as **clients**.
3. On the server, open Aether and arrange the screen grid to match your physical desk layout.
4. Enter the client computer names in the grid to match their hostnames.
5. Start the server on the main machine and connect from the clients.
6. Move your cursor to the edge of the server screen and it appears on the client.

See the [help guide](docs/HelpMain.md) for detailed setup instructions.

## System requirements

- Windows 10 or later, or a modern Linux distribution with X11 or Wayland
- All machines on the same local network
- Port 24800 accessible (TCP) between machines
- Qt 6.7+ and OpenSSL 3.0+ (bundled in prebuilt packages)

## Build from source

See [docs/dev/build.md](docs/dev/build.md) for the complete build guide. Quick start:

```bash
cmake -S . -B build
cmake --build build
```

Requirements: CMake 3.24+, Qt 6.7+, OpenSSL 3.0+. Most other dependencies are fetched automatically by CMake.

## Documentation

- [Configuration](docs/Configuration.md)
- [Auto-update](docs/AutoUpdate.md)
- [Help guide](docs/HelpMain.md)
- [Build guide](docs/dev/build.md)
- [Protocol reference](docs/dev/protocol_reference.md)
- [Security policy](docs/Security.md)
- [Issue reporting](docs/Issues.md)

## Security

Security issues should follow the policy in [docs/Security.md](docs/Security.md).

## License

Aether is distributed under GPL-2.0 with an OpenSSL exception. Source code is licensed under a GPL-2.0-only with OpenSSL exception, or as noted per file. See `LICENSE` and `LICENSES/` for details.

## Credits

Aether is a fork of the Synergy codebase, rebranded and maintained by Rimora Studio (developer: Xeleste). The original Synergy and Barrier projects deserve credit for the protocol and core implementation.
