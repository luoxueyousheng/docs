---
order: 4
---

# Example Code

## Complete Desktop Application Example

A complete application that includes window management, IPC communication, tray, and notifications:

```python
import jadeview
from jadeview import events, ipc, window, tray, notification, tools

main_win_id = 0
tray_id = 0

def on_ready(window_id, data):
    global main_win_id, tray_id

    print(f"JadeView {tools.jadeview_version()}")

    # Set up the local file service
    base_url = tools.set_protocol_service_path("C:/myapp/web")

    # Create the main window
    main_win_id = window.create_webview_window(
        f"{base_url}index.html",
        title="My Application",
        width=1100, height=800,
        theme="System",
        min_width=800, min_height=600,
    )

    # Create the tray
    tray_id = tray.tray_create()
    tray.tray_set_tooltip(tray_id, "My Application")
    tray.tray_set_menu_items(tray_id, [
        {"item_type": 0, "key": "show", "label": "Show Window"},
        {"item_type": 2, "key": "sep", "label": ""},
        {"item_type": 0, "key": "quit", "label": "Quit", "dangerous": 1},
    ])

    # Show a notification
    notification.show_notification("Application Started", body="Welcome to My Application")

def on_window_closing(window_id, data):
    return None  # Allow closing

def on_all_closed(window_id, data):
    if tray_id:
        tray.tray_destroy(tray_id)
    jadeview.cleanup()

# Register IPC handler
def handle_get_info(window_id, payload):
    return {
        "version": tools.jadeview_version(),
        "locale": tools.get_locale(),
        "window_count": tools.get_window_count(),
    }

# Setup
ipc.on(events.APP_READY, on_ready)
ipc.on(events.WINDOW_CLOSING, on_window_closing)
ipc.on(events.WINDOW_ALL_CLOSED, on_all_closed)
ipc.register_ipc_handler("get-info", handle_get_info)

# Start
jadeview.init("MyApp", "myapp1", enable_devmod=True)
jadeview.run()
```

## File Dialog Example

```python
from jadeview import dialog

# Select a single file
result = dialog.show_open_dialog(
    window_id,
    title="Select Image",
    filters='[{"name":"Images","extensions":["jpg","png","gif"]}]',
    properties="openFile",
)
if result and not result["canceled"]:
    print(f"Selected file: {result['file_paths']}")

# Select multiple files
result = dialog.show_open_dialog(
    window_id,
    title="Select Multiple Files",
    properties="openFile,multiSelections",
)

# Select a folder
result = dialog.show_open_dialog(
    window_id,
    title="Select Folder",
    properties="openDirectory",
)

# Save a file
result = dialog.show_save_dialog(
    window_id,
    title="Save File",
    default_path="report.txt",
    filters='[{"name":"Text Files","extensions":["txt","md"]},{"name":"All Files","extensions":["*"]}]',
)
if result and not result["canceled"]:
    print(f"Save path: {result['file_path']}")
```

## Asynchronous Dialog Example

```python
from jadeview import dialog

def on_file_selected(result):
    if result and not result["canceled"]:
        print(f"Async selection: {result['file_paths']}")
    else:
        print("User canceled the selection")

dialog.show_open_dialog_async(
    on_file_selected,
    window_id,
    title="Async File Selection",
    properties="openFile,multiSelections",
)
```

## Multi-Window Management Example

```python
import jadeview
from jadeview import window, ipc, events

main_win = 0
child_windows = []

def on_ready(window_id, data):
    global main_win
    base_url = jadeview.tools.set_protocol_service_path("C:/myapp/web")
    main_win = window.create_webview_window(
        f"{base_url}index.html",
        title="Main Window",
    )

def create_child():
    """Create a child window"""
    base_url = jadeview.tools.set_protocol_service_path("C:/myapp/web")
    child_id = window.create_webview_window(
        f"{base_url}child.html",
        parent_window_id=main_win,
        title=f"Child Window #{len(child_windows) + 1}",
        width=640, height=480,
    )
    if child_id:
        child_windows.append(child_id)
    return child_id

def on_window_closing(window_id, data):
    if window_id in child_windows:
        child_windows.remove(window_id)
    return None

ipc.on(events.APP_READY, on_ready)
ipc.on(events.WINDOW_CLOSING, on_window_closing)
ipc.on(events.WINDOW_ALL_CLOSED, lambda w, d: jadeview.cleanup())
ipc.register_ipc_handler("create-child", lambda w, p: {"id": create_child()})

jadeview.init("MultiWinApp", "multiwin1")
jadeview.run()
```

## Global Hotkey + System Notification Example

```python
import jadeview
from jadeview import tools, notification, ipc, events, window

hotkey_id = 0
main_win_id = 0

def on_ready(window_id, data):
    global hotkey_id, main_win_id
    main_win_id = window.create_webview_window(
        "https://example.com",
        title="Hotkey Demo",
    )
    hotkey_id = tools.register_global_hotkey("CTRL+ALT", "J")
    print(f"Hotkey registered: id={hotkey_id}")

def on_hotkey(window_id, data):
    notification.show_notification(
        "Hotkey Triggered",
        body="You pressed Ctrl+Alt+J",
        button1="Open Window",
        action="show_window",
    )
    if main_win_id:
        window.set_window_focus(main_win_id)

ipc.on(events.APP_READY, on_ready)
ipc.on(events.GLOBAL_HOTKEY, on_hotkey)
ipc.on(events.WINDOW_ALL_CLOSED, lambda w, d: jadeview.cleanup())

jadeview.init("HotkeyApp", "hotkey1")
jadeview.run()
```
