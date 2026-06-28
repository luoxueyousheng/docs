---
order: 2
---

# API Reference

## Core Functions

### `jadeview.init()`

Initializes the JadeView application. You must first register a ready callback via `jadeview.ipc.on("app-ready", callback)`, then call this function.

```python
jadeview.init(
    app_name: str,            # Application display name
    app_signature: str,       # Unique application identifier (>=6 characters)
    *,
    enable_devmod: bool = False,     # Whether to enable developer tools
    log_path: str | None = None,     # Log file path
    data_directory: str | None = None,  # Data root directory
    single_instance: bool = False,   # Whether to use single-instance mode
) -> bool
```

### `jadeview.run()`

Starts the message loop (blocks the current thread). Call after `init()`.

```python
jadeview.run() -> bool
```

### `jadeview.cleanup()`

Cleans up all windows and prepares to exit. Typically called inside the `window-all-closed` event callback.

```python
jadeview.cleanup() -> bool
```

---

## jadeview.window — Window Management

### `create_webview_window()`

Creates a standard WebView window.

```python
window.create_webview_window(
    url: str,                          # URL to load
    parent_window_id: int = 0,         # Parent window ID, 0 for a top-level window
    *,
    title: str | None = None,          # Window title
    width: int = 800,                  # Width (pixels)
    height: int = 600,                 # Height (pixels)
    resizable: int = 1,                # Whether the window is resizable
    frame_style: str | None = None,    # Frame style: "normal"/"no-titlebar"/"borderless"
    transparent: int = 0,              # Transparent background
    background_color: str | None = None,  # Background color "#RRGGBB"
    always_on_top: int = 0,            # Keep window on top
    theme: str | None = None,          # "Light"/"Dark"/"System"
    maximized: int = 0,                # Open maximized
    maximizable: int = 1,              # Allow maximizing
    minimizable: int = 1,              # Allow minimizing
    x: int = -1, y: int = -1,         # Window position, centered when both are -1
    min_width: int = 0, min_height: int = 0,   # Minimum size constraints
    max_width: int = 0, max_height: int = 0,   # Maximum size constraints
    fullscreen: int = 0,               # Open in fullscreen
    focus: int = 1,                    # Acquire focus on creation
    hide_window: int = 0,              # Create hidden
    use_page_icon: int = 0,            # Use the web page icon
    content_protection: int = 0,       # Prevent screen capture
    auto_save_state: int = 0,          # Automatically remember window position
    autoplay: int = 0,                 # Autoplay media
    background_throttling: int = 1,    # Throttle frame rate in the background
    disable_right_click: int = 0,      # Disable right-click
    ua: str | None = None,             # Custom User-Agent
    preload_js: str | None = None,     # Preinjected JS
    allow_fullscreen: int = 1,         # Allow the Fullscreen API
    postmessage_whitelist: str | None = None,  # postMessage whitelist
) -> int  # window_id (>0 success, 0 failure)
```

### `create_borderless_webview_window()`

Creates a borderless WebView window. You can obtain its HWND via `get_window_hwnd()` for custom operations.

```python
window.create_borderless_webview_window(url: str, **webview_settings) -> int
```

### Window Operation Functions

| Function | Description |
|------|------|
| `set_window_title(window_id, title)` | Set the window title |
| `set_window_size(window_id, width, height)` | Set the window size |
| `set_window_position(window_id, x, y)` | Set the window position |
| `set_window_visible(window_id, visible)` | Show/hide the window |
| `set_window_focus(window_id)` | Give the window focus |
| `set_window_always_on_top(window_id, always_on_top)` | Set the window to stay on top |
| `close_window(window_id)` | Close the window |
| `minimize_window(window_id)` | Minimize the window |
| `toggle_maximize_window(window_id)` | Toggle maximize/restore |
| `is_window_maximized(window_id)` | Query whether the window is maximized |
| `set_window_fullscreen(window_id, fullscreen)` | Set fullscreen |
| `set_window_enabled(window_id, enabled)` | Enable/disable window interaction |
| `request_redraw(window_id)` | Request a redraw |
| `get_window_hwnd(window_id)` | Get the HWND of a borderless window |

### Theme and Appearance

| Function | Description |
|------|------|
| `set_window_theme(window_id, theme)` | Set the theme: "Light"/"Dark"/"System" |
| `get_window_theme(window_id)` | Get the current theme code |
| `set_window_backdrop(window_id, backdrop_type)` | Set the backdrop effect: "mica"/"micaAlt"/"acrylic" |
| `set_window_background_color(window_id, color)` | Set the background color "#RRGGBB" |

---

## jadeview.ipc — Events and IPC Communication

### `on()`

Subscribes to an event.

```python
ipc.on(
    event_name: str,    # Event name (see the events module)
    callback: Callable[[int, str], str | None],
    # callback(window_id, event_data) -> None to allow / True to intercept / str to return data
) -> int  # callback_id (>0 success), used to cancel with off()
```

### `off()`

Cancels an event subscription.

```python
ipc.off(event_name: str, callback_id: int) -> bool
```

### `register_ipc_handler()`

Registers an IPC channel handler that receives `jade.invoke()` calls from the frontend.

```python
ipc.register_ipc_handler(
    channel: str,       # Channel name
    handler: Callable[[int, str], str | dict | None],
    # handler(window_id, payload) -> None / dict (auto JSON) / str
) -> bool
```

### `send_ipc_message()`

Sends an IPC message to the frontend of a specified window.

```python
ipc.send_ipc_message(
    window_id: int,       # Target window ID
    message_type: str,    # Message type (received on the frontend via jade.on(type, ...))
    content: str | dict,  # Message content (a dict is automatically converted to JSON)
) -> bool
```

---

## jadeview.webview — WebView Operations

| Function | Description |
|------|------|
| `navigate_to_url(window_id, url)` | Navigate to the specified URL |
| `reload(window_id)` | Reload the current page |
| `execute_javascript(window_id, script)` | Execute JS (the result is returned via the `javascript-result` event) |
| `set_zoom(window_id, level)` | Set the zoom level (1.0 = 100%) |
| `set_content_protection(window_id, enabled)` | Enable/disable screen-capture protection |

---

## jadeview.window — Frame Style (added in 2.1)

### `set_window_frame_style()`

Changes the window frame style at runtime, without recreating the window.

```python
window.set_window_frame_style(
    window_id: int,
    frame_style: str,   # "normal"/"no-titlebar"/"borderless"/"title-overlay"
) -> bool
```

### `set_titlebar_overlay_style()`

Customizes the appearance of the titlebar button overlay for windows using the title-overlay style (runtime customization currently takes effect on Windows only; Linux shows the overlay with the built-in default style).

Only effective for windows with `frame_style="title-overlay"`.

```python
window.set_titlebar_overlay_style(
    window_id: int,
    height: int = 0,                    # Button height (pixels); 0 uses the default value of 32. Button width is fixed at 45 pixels
    icon_color_hex: str | None = None,  # Icon color "#RRGGBB"
    hover_bg_hex: str | None = None,    # Hover background color for non-close buttons "#RRGGBB" or "#RRGGBBAA"
) -> bool
```

:::info
The close button's hover background color is fixed at red (#E81123) and its icon is fixed at white; these are not affected by this API.
:::

### `jade_print()`

Prints the WebView content (opens the system print dialog).

```python
window.jade_print(window_id: int) -> bool
```

---

## jadeview.window — New WebView Settings Parameters (2.1)

New parameters for `create_webview_window()` and `create_borderless_webview_window()`:

| Parameter | Description |
|------|------|
| `cors_whitelist: str \| None` | CORS origin whitelist |

---

## jadeview.dialog — Dialogs

### Synchronous API

```python
# Open file dialog
dialog.show_open_dialog(
    window_id=0, *, title=None, default_path=None,
    button_label=None, filters=None,
    properties="openFile",  # "openFile,openDirectory,multiSelections,showHiddenFiles"
) -> dict | None  # {"canceled": bool, "file_paths": [...]}

# Save file dialog
dialog.show_save_dialog(
    window_id=0, *, title=None, default_path=None,
    button_label=None, filters=None,
) -> dict | None  # {"canceled": bool, "file_path": "..."}

# Message box
dialog.show_message_box(
    window_id=0, *, title=None, message=None, detail=None,
    buttons=None,       # "|" separated, e.g. "OK|Cancel"
    default_id=0, cancel_id=-1,
    type_="info",       # "none"/"info"/"warning"/"error"/"question"
) -> dict | None  # {"response": int}

# Error box (simple mode)
dialog.show_error_box(window_id=0, title="Error", content="") -> int
```

### Asynchronous API

The asynchronous versions append `_async` to the function name, with the callback function as the first parameter:

```python
dialog.show_open_dialog_async(callback, window_id=0, **kwargs) -> bool
dialog.show_save_dialog_async(callback, window_id=0, **kwargs) -> bool
dialog.show_message_box_async(callback, window_id=0, **kwargs) -> bool
```

---

## jadeview.tray — System Tray

```python
tray.tray_create() -> int                            # Create a tray, returns tray_id
tray.tray_destroy(tray_id) -> bool                   # Destroy the tray
tray.tray_set_visible(tray_id, visible) -> bool      # Show/hide
tray.tray_set_tooltip(tray_id, tooltip) -> bool      # Set the tooltip text
tray.tray_set_icon_from_file(tray_id, icon_path) -> bool  # Set the icon (.ico file)
tray.tray_set_menu_items(tray_id, items) -> bool     # Set the context menu
```

Menu item format:

```python
items = [
    {"item_type": 0, "key": "open", "label": "Open"},           # Normal item
    {"item_type": 2, "key": "sep1", "label": ""},               # Divider
    {"item_type": 1, "key": "submenu", "label": "Submenu"},       # Submenu
    {"item_type": 0, "key": "child", "label": "Child item", "parent_key": "submenu"},
    {"item_type": 0, "key": "exit", "label": "Exit", "dangerous": 1},
]
```

- `item_type`: 0=normal / 1=submenu / 2=divider / 3=group
- `parent_key`: the key of the parent menu, used for nested submenus

---

## jadeview.notification — System Notifications

```python
notification.show_notification(
    summary: str,                     # Notification title (required)
    *,
    body: str | None = None,          # Notification body
    icon: str | None = None,          # Absolute path to the icon file
    timeout: int = 0,                 # Timeout in milliseconds (<=0 uses the system default)
    button1: str | None = None,       # Text of the first button
    button2: str | None = None,       # Text of the second button
    text3: str | None = None,         # Additional text
    action: str | None = None,        # Action parameter (returned via the notification-action event)
) -> bool
```

---

## jadeview.tools — Utility Functions

### Version and System Information

| Function | Description |
|------|------|
| `jadeview_version()` | Get the JadeView version number |
| `get_webview_version()` | Get the WebView2 runtime version number |
| `is_windows_11()` | Whether the system is Windows 11 |
| `get_window_count()` | Current number of windows |
| `get_locale()` | System language setting, e.g. "zh-CN" |
| `get_displays_info()` | Information about all displays |
| `get_path(name)` | System paths: home/appData/temp/desktop/documents/downloads, etc. |

### YAML Configuration Storage

```python
tools.yaml_set(file_name, key_path, value) -> bool  # Write
tools.yaml_get(file_name, key_path) -> str | None    # Read
```

### Protocol Service (Local File Server)

```python
tools.set_protocol_service_path(root_path) -> str | None  # Returns the base URL
```

### URL Schemes and File Associations

```python
tools.register_url_scheme(scheme) -> bool        # Register a custom protocol
tools.unregister_url_scheme(scheme) -> bool
tools.register_file_association(extension, friendly_name) -> bool
tools.unregister_file_association(extension) -> bool
```

### Global Hotkeys

```python
tools.register_global_hotkey(modifiers, vk) -> int    # Returns hotkey_id
tools.unregister_global_hotkey(hotkey_id) -> bool
```

- `modifiers` supports: integer bitmask, `"CTRL+ALT"`, `["CTRL", "SHIFT"]`
- `vk` supports: integer virtual key code, strings such as `"F1"`, `"K"`, `"Enter"`

### Data Directory

```python
tools.clear_data_directory() -> bool  # Clear the application data directory (irreversible)
```

---

## jadeview.events — Event Constants

### Application Lifecycle

| Constant | Value | Description |
|------|---|------|
| `APP_READY` | `"app-ready"` | Application is ready |
| `SECOND_INSTANCE` | `"second-instance"` | A second instance has started |

### Window Lifecycle

| Constant | Value | Description |
|------|---|------|
| `WINDOW_CREATED` | `"window-created"` | Window has been created |
| `APP_WINDOW_CREATED` | `"app-window-created"` | Window has been created (alias) |
| `WINDOW_CLOSING` | `"window-closing"` | Window is about to close (can be intercepted) |
| `WINDOW_CLOSED` | `"window-closed"` | Window has been closed |
| `WINDOW_DESTROYED` | `"window-destroyed"` | Window has been destroyed |
| `WINDOW_ALL_CLOSED` | `"window-all-closed"` | All windows have been closed |

### Window State

| Constant | Value | Description |
|------|---|------|
| `WINDOW_RESIZED` | `"window-resized"` | Size changed |
| `WINDOW_STATE_CHANGED` | `"window-state-changed"` | Maximize state changed |
| `WINDOW_FULLSCREEN` | `"window-fullscreen"` | Fullscreen state changed |
| `WINDOW_MOVED` | `"window-moved"` | Position changed |
| `WINDOW_FOCUSED` | `"window-focused"` | Gained focus |
| `WINDOW_BLURRED` | `"window-blurred"` | Lost focus |

### WebView / Navigation

| Constant | Value | Description |
|------|---|------|
| `WEBVIEW_WILL_NAVIGATE` | `"webview-will-navigate"` | About to navigate (can be intercepted) |
| `WEBVIEW_DID_START_LOADING` | `"webview-did-start-loading"` | Started loading |
| `WEBVIEW_DID_FINISH_LOAD` | `"webview-did-finish-load"` | Finished loading |
| `WEBVIEW_NEW_WINDOW` | `"webview-new-window"` | New window request (can be intercepted) |
| `WEBVIEW_PAGE_TITLE_UPDATED` | `"webview-page-title-updated"` | Page title changed |
| `WEBVIEW_PAGE_ICON_UPDATED` | `"webview-page-icon-updated"` | Page icon changed |
| `WEBVIEW_DOWNLOAD_STARTED` | `"webview-download-started"` | Download started |
| `JAVASCRIPT_RESULT` | `"javascript-result"` | JS execution result |
| `DRAG_DROP` | `"drag-drop"` | Drag-and-drop lifecycle event *(replaces `file-drop` in 2.2)* |
| `POSTMESSAGE_RECEIVED` | `"postmessage-received"` | postMessage received |
| `JAPK_LOAD_SUCCESS` | `"japk-load-success"` | JAPK loaded successfully |
| `JAPK_LOAD_FAILED` | `"japk-load-failed"` | JAPK failed to load |

### Tray / Notification / Hotkey / Theme

| Constant | Value | Description |
|------|---|------|
| `TRAY_MENU_COMMAND` | `"tray-menu-command"` | Tray menu item clicked |
| `TRAY_EVENT` | `"tray-event"` | Tray icon interaction |
| `NOTIFICATION_SHOWN` | `"notification-shown"` | Notification shown |
| `NOTIFICATION_DISMISSED` | `"notification-dismissed"` | Notification dismissed |
| `NOTIFICATION_FAILED` | `"notification-failed"` | Notification failed |
| `NOTIFICATION_ACTION` | `"notification-action"` | Notification button clicked |
| `GLOBAL_HOTKEY` | `"global-hotkey"` | Global hotkey triggered |
| `THEME_CHANGED` | `"theme-changed"` | Theme changed |
| `UPDATE_WINDOW_ICON` | `"update-window-icon"` | Window icon needs refreshing |

### Tray Menu Item Type Constants

| Constant | Value | Description |
|------|---|------|
| `TRAY_ITEM_NORMAL` | `0` | Normal menu item |
| `TRAY_ITEM_SUBMENU` | `1` | Submenu |
| `TRAY_ITEM_DIVIDER` | `2` | Divider |
| `TRAY_ITEM_GROUP` | `3` | Group |

---

## jadeview.japk — JAPK Resource Bundle Loading (added in 2.1)

JAPK is JadeView's resource packaging format. It supports packaging frontend resources into a single `.japk` file, with Ed25519 signature verification.

### `set_public_key()`

Sets the Ed25519 public key used to verify JAPK signatures.

```python
japk.set_public_key(public_key: str) -> int  # Base64-encoded public key
```

### `load_from_bytes()`

Loads a JAPK bundle from memory. After it loads successfully, the protocol service automatically serves resources from within the bundle.

```python
japk.load_from_bytes(data: bytes | bytearray | memoryview) -> int
```

### `is_loaded()`

Queries whether a JAPK is loaded.

```python
japk.is_loaded() -> bool
```

### `get_app_signature()`

Gets the app_signature of the currently loaded bundle.

```python
japk.get_app_signature() -> str | None
```

### `get_signature_info()`

Gets the signature information, returning a parsed dict or the raw string.

```python
japk.get_signature_info() -> dict | str | None
```

### `unload()`

Unloads the current JAPK bundle and frees the memory.

```python
japk.unload() -> int
```
