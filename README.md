# Aether

Aether is an open-source keyboard and mouse sharing utility. Use one keyboard, mouse, or trackpad to control nearby computers as if they shared a single desktop. It supports Windows, macOS, and Linux, keeps traffic encrypted with TLS, and stays compatible with the Synergy and Barrier wire protocols.

Aether is based on Deskflow, an open-source fork of the Synergy code base.

## Features

- **One input for many machines.** Drag the cursor from one screen to the next.
- **Cross-platform.** Windows, macOS, and Linux (X11 and Wayland).
- **Clipboard sharing.** Copy and paste text and images between systems.
- **Encrypted network traffic.** TLS encryption between server and clients.
- **Protocol compatibility.** Works with both Synergy and Barrier protocol peers.
- **Qt-based GUI.** Clean configuration, auto-start, and system-tray controls.

## Download and install

Prebuilt installers and packages are available on the [releases page](https://github.com/neang-mengseang/Aether/releases). Choose the file that matches your operating system.

### Windows

1. Download the latest `aether-<version>-windows-x64.msi` from releases.
2. Run the installer and follow the prompts.
3. Launch **Aether** from the Start menu or desktop shortcut.

### macOS

1. Download the latest `aether-<version>-macos.dmg` from releases.
2. Open the DMG and drag **Aether** into Applications.
3. Launch Aether from Applications.

### Linux

Flatpak, deb, rpm, and an Arch PKGBUILD are supported.

- **Flatpak**: build from `deploy/linux/flatpak/org.aether.aether.yml`.
- **Debian/Ubuntu**: install the `.deb` package from releases.
- **Fedora/openSUSE**: install the `.rpm` package from releases.
- **Arch**: run `makepkg` on the generated `PKGBUILD` in the build output.

## Build from source

See [docs/dev/build.md](docs/dev/build.md) for the complete build guide. In short:

```bash
cmake -S . -B build
cmake --build build
```

The build requires CMake 3.24+, Qt 6.7+, and OpenSSL 3.0+. Dependencies are fetched automatically when missing.

## Documentation

- [Configuration](docs/Configuration.md)
- [Build guide](docs/dev/build.md)
- [Protocol reference](docs/dev/protocol_reference.md)
- [Security policy](docs/Security.md)
- [Issue reporting](docs/Issues.md)

## Security

Security issues should follow the policy in [docs/Security.md](docs/Security.md).

## License

Aether is distributed under the same licenses as Deskflow. Source code is licensed under a GPL-2.0-only with OpenSSL exception, or as noted per file. See `LICENSE` and `LICENSES/` for details.
