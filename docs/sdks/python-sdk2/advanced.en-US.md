---
order: 3
---

# Advanced Usage

## Intercepting Window Close

By listening to the `window-closing` event, you can intercept window close behavior, for example by popping up a confirmation dialog:

```python
from jadeview import events, ipc, dialog

def on_window_closing(window_id, data):
    result = dialog.show_message_box(
        window_id,
        title="Confirm",
        message="Are you sure you want to close the window?",
        buttons="OK|Cancel",
        type_="question",
    )
    if result and result["response"] == 1:
        return True  # Return True to intercept the close
    return None      # Return None to allow the close

ipc.on(events.WINDOW_CLOSING, on_window_closing)
```

## IPC Bidirectional Communication

### Python → Frontend

Use `send_ipc_message` to push messages to the frontend:

```python
# Python side
ipc.send_ipc_message(window_id, "update-data", {"count": 42})
```

```javascript
// Frontend JS
jade.on("update-data", (data) => {
    console.log(data.count); // 42
});
```

### Frontend → Python

The frontend uses `jade.invoke()`, and the Python side uses `register_ipc_handler` to receive:

```python
# Python side
def handle_get_user(window_id, payload):
    return {"name": "Zhang San", "age": 30}  # dict is automatically serialized to JSON

ipc.register_ipc_handler("get-user", handle_get_user)
```

```javascript
// Frontend JS
const user = await jade.invoke("get-user", "some-payload");
console.log(user.name); // "Zhang San"
```

## Local File Serving (Protocol Service)

JadeView provides a built-in protocol service that maps a local directory to an accessible URL:

```python
from jadeview import tools, window

def on_ready(window_id, data):
    base_url = tools.set_protocol_service_path("C:/myapp/web")
    # base_url is similar to "http://jade.myapp/base/"

    window.create_webview_window(
        f"{base_url}index.html",
        title="Local App",
    )
```

This approach is more secure than the `file://` protocol and avoids cross-origin restriction issues.

## System Tray and Menu

```python
from jadeview import tray, ipc, events

tray_id = 0

def on_ready(window_id, data):
    global tray_id
    tray_id = tray.tray_create()
    tray.tray_set_tooltip(tray_id, "My App - Running")
    tray.tray_set_icon_from_file(tray_id, "C:/myapp/icon.ico")
    tray.tray_set_menu_items(tray_id, [
        {"item_type": 0, "key": "show", "label": "Show Window"},
        {"item_type": 1, "key": "theme", "label": "Theme"},
        {"item_type": 0, "key": "light", "label": "Light", "parent_key": "theme"},
        {"item_type": 0, "key": "dark", "label": "Dark", "parent_key": "theme"},
        {"item_type": 2, "key": "sep", "label": ""},
        {"item_type": 0, "key": "quit", "label": "Quit", "dangerous": 1},
    ])

def on_tray_menu(window_id, data):
    # data is a JSON string containing the key of the clicked menu item
    print(f"Tray menu clicked: {data}")

ipc.on(events.TRAY_MENU_COMMAND, on_tray_menu)
```

## Global Hotkeys

```python
from jadeview import tools, ipc, events, window

hotkey_id = 0
main_win_id = 0

def on_ready(window_id, data):
    global hotkey_id
    # Register Ctrl+Alt+K
    hotkey_id = tools.register_global_hotkey("CTRL+ALT", "K")

def on_hotkey(window_id, data):
    print("Hotkey triggered!")
    # For example: bring the window to the front
    if main_win_id:
        window.set_window_focus(main_win_id)

ipc.on(events.GLOBAL_HOTKEY, on_hotkey)
```

Modifier keys support multiple notations:
- String: `"CTRL+ALT"`, `"CTRL+SHIFT"`
- List: `["CTRL", "ALT"]`
- Integer: `MOD_CONTROL | MOD_ALT`

Main keys support:
- Letters: `"A"` - `"Z"`
- Function keys: `"F1"` - `"F24"`
- Special keys: `"Enter"`, `"Space"`, `"ESC"`, etc.

## YAML Configuration Persistence

The SDK includes a built-in YAML configuration storage feature, suitable for saving user preferences:

```python
from jadeview import tools

# Write configuration
tools.yaml_set("settings.yaml", "ui.theme", "dark")
tools.yaml_set("settings.yaml", "ui.language", "zh-CN")

# Read configuration
theme = tools.yaml_get("settings.yaml", "ui.theme")    # "dark"
lang = tools.yaml_get("settings.yaml", "ui.language")   # "zh-CN"
```

The configuration file is automatically saved in the application data directory.

## Window Backdrop Effects (Windows 11)

On Windows 11, you can use backdrop effects such as Mica/Acrylic:

```python
from jadeview import window, tools

def on_ready(window_id, data):
    win_id = window.create_webview_window(
        "https://example.com",
        title="Mica Effect Demo",
        transparent=1,  # Transparency must be enabled
    )

    if tools.is_windows_11():
        window.set_window_backdrop(win_id, "mica")     # Mica effect
        # window.set_window_backdrop(win_id, "micaAlt")  # Mica Alt
        # window.set_window_backdrop(win_id, "acrylic")  # Acrylic frosted glass
```

## URL Scheme and File Association

```python
from jadeview import tools

# Register custom protocol myapp://
tools.register_url_scheme("myapp")

# Register file association .mydata
tools.register_file_association("mydata", "My Data File")

# Unregister
tools.unregister_url_scheme("myapp")
tools.unregister_file_association("mydata")
```

## Switching Frame Style at Runtime (New in 2.1)

Version 2.1 supports dynamically switching the window frame style at runtime, without destroying and recreating the window:

```python
from jadeview import window

# Switch to no titlebar
window.set_window_frame_style(win_id, "no-titlebar")

# Switch to title-overlay (Windows and Linux, titlebar buttons overlaid on the content)
window.set_window_frame_style(win_id, "title-overlay")

# Customize the overlay button style
window.set_titlebar_overlay_style(
    win_id,
    height=40,
    icon_color_hex="#FFFFFF",
    hover_bg_hex="#3B3B3B80",
)

# Switch back to the standard frame
window.set_window_frame_style(win_id, "normal")
```

Available `frame_style` values:
- `"normal"` — bordered + titlebar (default)
- `"no-titlebar"` — bordered + no titlebar
- `"borderless"` — borderless + no titlebar
- `"title-overlay"` — bordered + titlebar buttons overlaid on the content (each button is 45 pixels wide, height defaults to 32 pixels)

## Printing WebView Content (New in 2.1)

```python
from jadeview import window

# Open the system print dialog
window.jade_print(win_id)
```

## JAPK Resource Bundle Loading (New in 2.1)

JAPK is JadeView's resource bundling format, which packs frontend files (HTML/CSS/JS/images, etc.) into a single `.japk` file, with support for Ed25519 signature verification.

### Basic Usage

```python
from jadeview import japk, tools, window

def on_ready(window_id, data):
    # 1. Set the public key (used to verify the signature)
    japk.set_public_key("Your Base64 public key")

    # 2. Read the .japk file and load it into memory
    with open("app.japk", "rb") as f:
        japk.load_from_bytes(f.read())

    # 3. Check whether loading succeeded
    if japk.is_loaded():
        print(f"Loaded: {japk.get_app_signature()}")
        print(f"Signature info: {japk.get_signature_info()}")

    # 4. Set the protocol service path (resources are automatically served from the bundle after loading)
    base_url = tools.set_protocol_service_path("japk://")

    # 5. Create the window
    window.create_webview_window(f"{base_url}index.html", title="JAPK App")
```

### Switching the Resource Source at Runtime

```python
from jadeview import japk, tools, webview

def switch_to_japk(window_id, japk_path):
    """Switch to JAPK bundle resources"""
    with open(japk_path, "rb") as f:
        japk.load_from_bytes(f.read())
    base_url = tools.set_protocol_service_path(japk_path)
    webview.navigate_to_url(window_id, f"{base_url}index.html")
    webview.reload(window_id)

def switch_to_directory(window_id, dir_path):
    """Switch back to directory mode"""
    japk.unload()
    base_url = tools.set_protocol_service_path(dir_path)
    webview.navigate_to_url(window_id, f"{base_url}index.html")
    webview.reload(window_id)
```

### Related Events

| Event | Description |
|------|------|
| `japk-load-success` | Triggered when JAPK loading succeeds |
| `japk-load-failed` | Triggered when JAPK loading fails |

## Application Packaging

The SDK supports mainstream Python packaging tools. When packaging, you need to manually include the JadeView DLL in the output.

### DLL Search Mechanism

The SDK automatically searches for the DLL file in the following priority order:

1. **Environment variable** `JADEVIEW_DLL_PATH` — a directory manually specified by the user (highest priority)
2. **PyInstaller extraction directory** — `sys._MEIPASS` (PyInstaller-specific)
3. **exe directory** — the parent directory of `sys.executable` (Nuitka / cx_Freeze, etc.)
4. **Current working directory** — `os.getcwd()`
5. **Inside the SDK package** — `jadeview/dll/` (development mode)

Within each directory, three file layouts are checked:
- `{dir}/x64/JadeView_x64.dll`
- `{dir}/dll/x64/JadeView_x64.dll`
- `{dir}/JadeView_x64.dll`

### PyInstaller

```bash
pyinstaller --add-binary "jadeview/dll/x64/JadeView_x64.dll;." --noconsole main.py
```

Or in the `.spec` file:

```python
a = Analysis(...)
a.binaries += [('JadeView_x64.dll', 'jadeview/dll/x64/JadeView_x64.dll', 'BINARY')]
```

### Nuitka

```bash
nuitka --include-data-files=jadeview/dll/x64/JadeView_x64.dll=JadeView_x64.dll --windows-console-mode=disable main.py
```

If you need to preserve the subdirectory structure:

```bash
nuitka --include-data-dir=jadeview/dll=dll main.py
```

### cx_Freeze

In `setup.py`:

```python
from cx_Freeze import setup, Executable

setup(
    executables=[Executable("main.py")],
    options={
        "build_exe": {
            "include_files": [
                ("jadeview/dll/x64/JadeView_x64.dll", "JadeView_x64.dll"),
            ],
        }
    },
)
```

### Custom DLL Path

If none of the automatic searches above meet your needs, you can specify the path via an environment variable:

```python
import os
os.environ["JADEVIEW_DLL_PATH"] = "C:/myapp/libs"

import jadeview  # will load the DLL from C:/myapp/libs
```

:::success
32-bit Python automatically loads `JadeView_x86.dll`, and 64-bit Python loads `JadeView_x64.dll`, with no manual selection required.
:::
