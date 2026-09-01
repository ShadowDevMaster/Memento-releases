# Memento — Downloads

Official download channel for **Memento**, a modern screen recorder for Windows.

This repository contains no source code. It exists to distribute release builds and the
`latest.json` manifest that the application uses to check for new versions.

## Download

Get the newest build from the [Releases page](https://github.com/ShadowDevMaster/Memento-releases/releases/latest).

| File | Use it when |
|---|---|
| `Memento-Setup-<version>.exe` | **Recommended.** Installs Memento with Start Menu and desktop shortcuts and an uninstaller. |
| `Memento_<version>.exe` | Portable — runs from anywhere, installs nothing. |

Both are 64-bit Windows builds. Installation is per-user and does not require administrator
rights.

## Windows SmartScreen

Release builds are not code-signed yet, so on first launch Windows may show
**"Windows protected your PC"**. This is a warning about an unrecognised publisher, not a
detection of anything harmful.

To continue, click **More info**, then **Run anyway**.

If you would rather verify the download yourself first, every release lists a SHA-256 checksum
for each file. Compare it against your copy:

```powershell
certutil -hashfile Memento-Setup-1.0.0.exe SHA256
```

The same checksums are available in machine-readable form in [`latest.json`](latest.json).

## System requirements

| | |
|---|---|
| **OS** | Windows 10 (1809 or later) or Windows 11, 64-bit |
| **CPU** | x64. A quad-core or better is recommended for software encoding |
| **RAM** | 4 GB minimum, 8 GB recommended for 4K |
| **Disk** | ~350 MB installed, plus room for recordings |
| **GPU** | Optional. NVIDIA (NVENC), AMD (AMF) or Intel (Quick Sync) enables hardware encoding |

## Version manifest

`latest.json` is the machine-readable description of the current release. The application reads
it to tell you when a newer version is available; it never downloads or installs anything on its
own.

```
https://raw.githubusercontent.com/ShadowDevMaster/Memento-releases/main/latest.json
```

It is regenerated automatically whenever a release is published here. See
[`scripts/build-manifest.mjs`](scripts/build-manifest.mjs).

## License

Memento is proprietary software. Use is governed by the [End User License Agreement](EULA.txt)
included with every build.

Memento bundles third-party components under their own licenses, most notably an unmodified
LGPL-3.0 build of FFmpeg that runs as a separate process and is never linked into the
application. The complete notices are installed alongside the application in
`resources/licenses/`.

## Support

Report a problem or ask a question in [Issues](https://github.com/ShadowDevMaster/Memento-releases/issues).

---

© 2026 k2-studio. All rights reserved.
