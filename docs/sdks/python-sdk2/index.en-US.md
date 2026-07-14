---
order: 0
---

# Introduction

Python SDK2 is the Python bindings library for JadeView 2.1. Built on ctypes to wrap the JadeView DLL, it lets you quickly build WebView2-based Windows desktop applications using Python.

The SDK's API naming style is kept consistent with the JadeView frontend JS API, lowering the learning curve for cross-language usage.

## Core Features

- **Window management**: Create standard/borderless WebView windows, control window size, position, fullscreen, and always-on-top, and switch border styles at runtime
- **IPC communication**: Event subscription (on/off), IPC channel handlers (register_ipc_handler), proactive message push (send_ipc_message)
- **Dialogs**: Open/save file dialogs, message boxes, and error boxes, supporting both synchronous and asynchronous modes
- **System tray**: Create a tray icon and set the context menu, tooltip text, and icon
- **System notifications**: Native Windows notifications, supporting buttons and custom actions
- **WebView operations**: Navigation, reload, execute JavaScript, zoom, anti-screenshot, and printing
- **JAPK packaging and loading**: Supports loading `.japk` resource packages from memory, with Ed25519 signature verification
- **Utility functions**: Version information, system paths, monitor information, YAML configuration storage, global hotkeys, URL Scheme registration, and file associations
- **Automatic adaptation**: Automatically loads the x64/x86 DLL based on the Python bitness

## Use Cases

- Developing Windows desktop applications with Python (frontend in HTML/CSS/JS, backend in Python)
- Tool/productivity applications that require WebView2 rendering capabilities
- Rapid prototyping and internal tools

## Technical Architecture

```
┌─────────────────────────────────────────┐
│              Python backend              │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │ window  │  │   ipc    │  │ dialog │ │
│  │ webview │  │  events  │  │  tray  │ │
│  │ tools   │  │          │  │ notify │ │
│  └─────────┘  └──────────┘  └────────┘ │
└─────────────────┬───────────────────────┘
                  │ ctypes / WinDLL
┌─────────────────┴───────────────────────┐
│       JadeView DLL (x64 / x86)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│        WebView2 / system WebView        │
│  ┌───────────────────────────────────┐  │
│  │       HTML / CSS / JavaScript      │  │
│  │            (frontend UI)           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## System Requirements

- **Python version**: Python 3.11+
- **Operating system**: Windows 10 / Windows 11
- **Runtime**: WebView2 Runtime (built into Windows 11; must be installed separately on Windows 10)
- **Dependency management**: [uv](https://github.com/astral-sh/uv) is recommended
- **External dependencies**: None (uses only the Python standard library)

## Installation

```bash
# Using uv (recommended)
uv add jadeview

# Or using pip
pip install jadeview
```

## Quick Example

```python
import jadeview
from jadeview import events

def on_ready(window_id, data):
    jadeview.window.create_webview_window(
        "https://example.com",
        title="Hello JadeView",
        width=1024,
        height=768,
    )

def on_all_closed(window_id, data):
    jadeview.cleanup()

jadeview.ipc.on(events.APP_READY, on_ready)
jadeview.ipc.on(events.WINDOW_ALL_CLOSED, on_all_closed)
jadeview.init("MyApp", "myapp1")
jadeview.run()
```

## Project Information

- **Version**: 2.1.1
- **License**: MIT
- **Source**: [GitHub](https://github.com/lazyso/jade-py-2-sdk)
