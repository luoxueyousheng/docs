---
order: 1
---

# Quick Start

## Requirements

- Windows 10 / Windows 11
- Python 3.11+
- WebView2 Runtime

## Install

```bash
# Using uv (recommended)
uv add jadeview

# Or using pip
pip install jadeview
```

## Minimal Example

Below is the simplest possible JadeView Python application:

```python
import jadeview
from jadeview import events

def on_ready(window_id, data):
    """Create the window after the app is ready"""
    win_id = jadeview.window.create_webview_window(
        "https://example.com",
        title="My First JadeView App",
        width=1024,
        height=768,
    )
    print(f"Window created: {win_id}")

def on_all_closed(window_id, data):
    """Quit after all windows are closed"""
    jadeview.cleanup()

# 1. Register events (must be done before init)
jadeview.ipc.on(events.APP_READY, on_ready)
jadeview.ipc.on(events.WINDOW_ALL_CLOSED, on_all_closed)

# 2. Initialize the app
jadeview.init("MyApp", "myapp1", enable_devmod=True)

# 3. Start the message loop (blocking)
jadeview.run()
```

## Application Lifecycle

1. **Register event callbacks** — use `jadeview.ipc.on()` to register lifecycle events such as `app-ready`
2. **Initialize** — call `jadeview.init()` to start the JadeView engine
3. **Create a window** — call `jadeview.window.create_webview_window()` inside the `app-ready` callback
4. **Message loop** — call `jadeview.run()` to enter the blocking message loop
5. **Quit** — call `jadeview.cleanup()` inside the `window-all-closed` callback to quit

## Loading Local HTML

You can use the protocol service to load local HTML files instead of a remote URL:

```python
def on_ready(window_id, data):
    # Set the local file service path
    base_url = jadeview.tools.set_protocol_service_path("C:/myapp/web")

    # Create the window and load the local page
    jadeview.window.create_webview_window(
        f"{base_url}index.html",
        title="Local App",
    )
```

## Module Overview

| Module | Import | Functionality |
|------|---------|------|
| `jadeview` | `import jadeview` | Initialization, message loop, cleanup |
| `jadeview.window` | `from jadeview import window` | Window creation and management |
| `jadeview.webview` | `from jadeview import webview` | Navigation, JS execution, zoom |
| `jadeview.ipc` | `from jadeview import ipc` | Event subscription, IPC communication |
| `jadeview.dialog` | `from jadeview import dialog` | System dialogs |
| `jadeview.tray` | `from jadeview import tray` | System tray |
| `jadeview.notification` | `from jadeview import notification` | System notifications |
| `jadeview.tools` | `from jadeview import tools` | Utility functions |
| `jadeview.japk` | `from jadeview import japk` | JAPK resource bundle loading |
| `jadeview.events` | `from jadeview import events` | Event name constants |
