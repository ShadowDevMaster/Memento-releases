# Changelog

Release notes for published Memento builds.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and Memento adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). A license key is valid for the
major version it was issued for, so every `1.x` release below is a free update for `1.0` owners.

## [1.0.0] — unreleased

First public release.

### Recording
- Full-screen, single-window, free-drawn region, and **All Screens** composite capture.
- Smart region snapping to window and container edges, with keyboard fine adjustment.
- Live MP4 encoding — stopping is instant, and an interrupted recording is still playable.
- Hardware encoding on NVENC, AMF and Quick Sync, each probed at startup with a software fallback.
- Pause/resume, a configurable countdown, and a floating always-on-top control widget.
- 720p / 1080p / 4K at 30 or 60 fps; MP4 or WebM output.

### Audio
- System audio, microphone, both mixed, or both as separate tracks.
- Independent gain per source, selectable microphone device, AAC 128–320 kbps.

### Overlays
- Camera overlay — webcam or avatar, with shape, frame and animation presets, draggable while
  recording.
- Mouse effects — click effects, cursor trails, and a draw-on-screen annotation mode.

### The app itself
- Runs entirely offline. No account, no telemetry, no analytics.
- Per-user installation; no administrator rights required.

[1.0.0]: https://github.com/ShadowDevMaster/Memento-releases/releases/tag/v1.0.0
