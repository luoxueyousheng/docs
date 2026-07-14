---
order: 5
---

# FAQ

## Installation and Environment

### Which operating systems does Python SDK2 support?

Only **Windows 10** and **Windows 11** are supported. The SDK is built on WebView2 and the Win32 API, and does not support macOS or Linux.

### What are the Python version requirements?

**Python 3.11** or higher is required. The SDK uses new syntax features such as `str | None`.

### Do I need to install the WebView2 Runtime?

- **Windows 11**: Built in, no additional installation required
- **Windows 10**: You need to install the [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Does the SDK have any additional Python dependencies?

No. The SDK uses only the Python standard library (ctypes, json, threading), with zero additional dependencies.

---

## Initialization and Lifecycle

### Why must I register events before calling init()?

`jadeview.init()` triggers the `app-ready` event internally. If you register the listener only after `init()`, you will miss this event and will not receive the ready notification.

### Why does run() block?

`jadeview.run()` starts the Windows Message Loop, which is the core of a desktop application. All window events and user interactions are dispatched through the message loop. The program blocks here until all windows are closed.

### How do I exit the application correctly?

Call `jadeview.cleanup()` in the `window-all-closed` event callback:

```python
def on_all_closed(window_id, data):
    jadeview.cleanup()  # This makes run() return

jadeview.ipc.on(events.WINDOW_ALL_CLOSED, on_all_closed)
```

---

## Window-Related

### How do I choose between the x64 and x86 DLL?

The SDK automatically detects the bitness of the current Python interpreter and loads the corresponding DLL. You do not need to choose manually.

### How do I create a window without a title bar?

Use the `frame_style` parameter:

```python
window.create_webview_window(
    url,
    frame_style="no-titlebar",  # No title bar
    # Or frame_style="borderless"  # Fully borderless
)
```

### What do the window positions x=-1, y=-1 mean?

When both `x` and `y` are -1, the window is automatically centered.

---

## IPC Communication

### What is the difference between returning different values in an on() callback?

| Return value | Effect |
|-------|------|
| `None` | Allow / default handling |
| `True` | Intercept the event (e.g., prevent the window from closing) |
| `str` | Return string data to the caller |

### What is the difference between register_ipc_handler and on?

- `on()`: Listens for system events (such as window creation, closing, etc.); a single event can have multiple listeners
- `register_ipc_handler()`: Registers an IPC channel handler that responds to the frontend's `jade.invoke()` calls; each channel has only one handler

---

## Dialogs

### How do I choose between synchronous and asynchronous dialogs?

- **Synchronous** (`show_open_dialog`): Blocks the current thread until the user completes the action; the code is simpler and more intuitive
- **Asynchronous** (`show_open_dialog_async`): Does not block, returns the result via a callback, suitable for scenarios where you do not want to block message processing

### What is the format of the filters parameter?

A JSON string in the following format:

```python
'[{"name":"Image Files","extensions":["jpg","png","gif"]},{"name":"All Files","extensions":["*"]}]'
```

---

## Packaging

### Which packaging tools are supported?

The SDK supports all mainstream Python packaging tools:
- **PyInstaller** — use the `--add-binary` parameter to include the DLL
- **Nuitka** — use the `--include-data-files` parameter to include the DLL
- **cx_Freeze** — add the DLL in `include_files`

For detailed usage, see [Advanced Usage - App Packaging](./advanced#app-packaging).

### What is JAPK?

JAPK is a resource packaging format added in JadeView 2.1 that bundles frontend files into a single `.japk` file. It supports Ed25519 signature verification and can be loaded from memory at runtime. For details, see [Advanced Usage - JAPK Resource Package Loading](./advanced#japk-resource-package-loading-21-new).

### Why can't the DLL be found after packaging?

Packaging tools only automatically analyze Python's `import` dependency chain. The SDK loads the DLL dynamically via `ctypes.WinDLL()`, and packaging tools **cannot automatically detect** this dependency, so you must manually add the DLL to the packaging configuration.

### Where should the DLL be placed after packaging?

The SDK automatically searches multiple locations; the simplest approach is to **place the DLL in the same directory as the exe**. The SDK searches in the following priority order:

1. The directory specified by the `JADEVIEW_DLL_PATH` environment variable
2. PyInstaller's `sys._MEIPASS` directory
3. The directory containing the exe
4. The current working directory
5. Inside the SDK package

### Can I customize the DLL load path?

Yes. Set the environment variable **before** `import jadeview`:

```python
import os
os.environ["JADEVIEW_DLL_PATH"] = "C:/myapp/libs"
import jadeview
```

---

## Troubleshooting

### "JadeView DLL not found" error

The SDK lists all searched directories in the error message. Please check:
- Whether the DLL file exists in any of the listed directories
- Whether the file name is correct (64-bit Python requires `JadeView_x64.dll`, 32-bit requires `JadeView_x86.dll`)
- If running after packaging, confirm that the DLL has been added to the packaging configuration

### init() returns False

- Check whether `app_signature` is >= 6 characters
- Check whether an instance with the same signature is already running (single-instance mode)
- Ensure the WebView2 Runtime is installed

### The callback function is not triggered

Ensure that you registered the event listener **before** calling `jadeview.init()`.

---

## Version Information

- **SDK version**: 2.1.1
- **Compatible JadeView**: 2.1.x
- **Python**: 3.11+
