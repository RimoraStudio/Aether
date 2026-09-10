# Changelog

All notable changes to Aether are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Auto-updater: download and install new versions automatically from GitHub releases (v1.1.0)
- SHA-256 checksum verification for downloaded installers
- Proxy support for update checks via HTTPS_PROXY
- Setting to disable update checks

### Changed
- Reworked website home page around distributed workspace value proposition
- Reworked About page roadmap into 5-phase unified distributed workspace vision
- Rewrote README with quick start section, badges, and online doc links
- Added Google site verification meta tag to home page
- Added release, license, platform, and PR badges to README

### Fixed
- Download page dropdown spacing between platform pills and download button

## [v1.0.0] - 2026-09-09

### Added
- Keyboard and mouse sharing across Windows and Linux
- Clipboard sharing for text, HTML, and BMP images
- TLS encrypted network traffic between server and clients
- Fingerprint-based peer verification
- Synergy and Barrier wire protocol compatibility
- Qt6 GUI with drag-and-drop screen layout editor
- System tray integration with quick start/stop
- Auto-start on login (optional)
- Version checker with update notification (notification only, no auto-update)
- Multi-language UI: English, Italian, Spanish, Japanese, Korean, Russian, Chinese
- Windows installers: MSI, EXE bootstrapper, 7Z portable
- Linux packages: DEB, RPM, tar.gz
- GitHub Actions CI/CD with Telegram notifications
- Configurable firewall rules on Windows
- X11 and Wayland backend auto-selection on Linux
- Official website with download, docs, and about pages

### Known Limitations
- No code signing (Windows SmartScreen warning)
- No auto-updater (only version check notification)
- Linux build lacks Wayland input capture (libei 1.3+ required, Ubuntu 24.04 has 1.2.1)
- No macOS support
- No dark mode in GUI
- No mDNS discovery (manual IP entry required)

[Unreleased]: https://github.com/RimoraStudio/Aether/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/RimoraStudio/Aether/releases/tag/v1.0.0
