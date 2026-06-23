---
title: 系统集成 API
order: 0
group:
  title: 系统与工具
  order: 5
---

# 系统集成 API

与操作系统交互的全局能力，不绑定特定窗口。包括协议注册、全局热键、剪贴板、鼠标位置、打印等。

若你只关心基础工具能力（版本、路径、语言、显示器、配置读写），请看 [工具 API](/docs/api/tools-api)。

---

## 协议与文件关联

### 自定义 URL 协议（`register_url_scheme` / `unregister_url_scheme`）

**用途**：在系统里登记**自定义 URL 协议**（例如 `myapp://open/...`），使用户在浏览器或其它应用里点开这类链接时，能启动你的 exe 并把 URL 传进来。卸载或关闭功能时可 `unregister` 取消登记。

```c
int32_t register_url_scheme(const char* scheme);
int32_t unregister_url_scheme(const char* scheme);
```

须已成功 `JadeView_init`，库要知道你的 exe 路径。若开了单实例，第二次启动可能通过 **`second-instance`** 把命令行交给第一次打开的进程，便于只处理一次协议 URL。

---

### 文件类型关联（`register_file_association` / `unregister_file_association`）

**用途**：让用户**双击某种扩展名**（如 `.mydata`）时，用当前应用打开。`friendly_name` 会出现在「打开方式」里给人看的名字。

```c
int32_t register_file_association(const char* extension, const char* friendly_name);
int32_t unregister_file_association(const char* extension);
```

扩展名可带或不带前面的点，内部会规范化。同样需要已完成初始化以关联到正确 exe。

---

## 全局输入

### 全局热键（`register_global_hotkey` / `unregister_global_hotkey`）

**用途**：注册**全局快捷键**（焦点不在你的窗口上也能响应），例如全局呼出主窗口、静音。按下后库会发事件 **`global-hotkey`**（负载为 JSON，含热键 id 与键值），你在 `jade_on` 里处理即可。

```c
uint32_t register_global_hotkey(uint32_t modifiers, uint32_t vk);
int32_t unregister_global_hotkey(uint32_t hotkey_id);
```

| 参数 | 说明 |
|------|------|
| `modifiers` | 组合键，使用 Windows 的 `MOD_CONTROL`、`MOD_SHIFT` 等按位或。 |
| `vk` | 主键虚拟键码，与 Win32 一致。 |

| 返回值 | 含义 |
|--------|------|
| `> 0` | 热键 id，注销时传给 `unregister_global_hotkey`。 |
| `0` | 注册失败（如组合键已被占用、键码不支持）。 |

事件字段说明见 [事件类型](/docs/api/event-types#global-hotkey)。

:::warning{title=平台差异}
- **Windows**：`RegisterHotKey`，全程可用。
- **Linux / X11**：经 x11rb 在 root 窗口抓键实现，可用；`modifiers` / `vk` 仍沿用 Windows 的 `MOD_*` / 虚拟键码（库内部映射到 X11）。
- **Linux / Wayland**：协议不允许普通客户端全局抓键，**优雅 no-op**，`register_global_hotkey` 返回 `0`。可设 `GDK_BACKEND=x11` 走 Xwayland 以启用。
:::

---

## 鼠标位置

### 获取鼠标位置（`get_cursor_position`）

:::warning
v2.2 开始支持。
:::

获取当前鼠标屏幕坐标（全局，不绑定窗口）。

```c
int32_t get_cursor_position(char* buffer, int buffer_size);
```

- **参数**：`buffer` `char*` - 输出缓冲区；`buffer_size` `int` - 缓冲区大小
- **返回值**：`1` = 成功，buffer 写入 JSON `{"x":0,"y":0}`；`0` = 失败

:::info{title=平台支持}
Windows（`GetCursorPos`）与 Linux/X11（x11rb `QueryPointer`）均可用。纯 Wayland（无 Xwayland）下可能返回 `0`。
:::

---

## 剪贴板

:::warning
v2.2 开始支持。
:::

依赖新增 `arboard` crate。

### 读取剪贴板文本（`clipboard_read_text`）

:::warning
v2.2 开始支持。
:::

```c
int32_t clipboard_read_text(char* buffer, int buffer_size);
```

- **参数**：`buffer` `char*` - 输出缓冲区；`buffer_size` `int` - 缓冲区大小
- **返回值**：`1` = 成功，`0` = 失败

---

### 写入剪贴板文本（`clipboard_write_text`）

:::warning
v2.2 开始支持。
:::

```c
int32_t clipboard_write_text(const char* text);
```

- **参数**：`text` `string` - 要写入的文本
- **返回值**：`1` = 成功，`0` = 失败

---

## 打印

:::warning
v2.2 开始支持。
:::

### 获取打印机列表（`jade_get_printer_list`）

:::warning
v2.2 开始支持。
:::

获取系统打印机列表，返回 JSON 数组字符串。

```c
int32_t jade_get_printer_list(char* buffer, int buffer_size);
```

- **参数**：`buffer` `char*` - 输出缓冲区；`buffer_size` `int` - 缓冲区大小（字节）
- **返回值**：`>0` = 打印机数量，buffer 中为 JSON 数组；`0` = 失败或无打印机

输出示例：

```json
["Microsoft Print to PDF","HP LaserJet Pro MFP M428fdw","Fax"]
```

:::info{title=平台支持}
Windows（`EnumPrintersW`）与 Linux（CUPS `lpstat -e`）均可用。Linux 需安装 CUPS 客户端（`cups-client`，提供 `lp`/`lpstat`）；未安装时返回 `0`。
:::

---

## 网络时间（NTP）

### 获取网络时间戳（`jade_ntp_now`）

:::warning
v2.3 开始支持。
:::

通过 NTP 协议（UDP/123）从网络授时服务器获取当前 UTC 时间戳，**不依赖本机系统时钟**，可用于防作弊、license 校验、日志时间对齐等场景。

无需 `JadeView_init`，可独立调用。需要本机具备 UDP 出站网络访问能力。

```c
int64_t jade_ntp_now(const char* ntp_server);
```

获取当前网络时间戳（**UTC 毫秒**，北京时间需 +8 小时）。

| 参数 | 说明 |
|------|------|
| `ntp_server` | NTP 服务器地址（如 `"ntp.aliyun.com"`）。传 `NULL`、空字符串或纯空白时，使用内置服务器列表逐个尝试。 |

| 返回值 | 含义 |
|--------|------|
| `>= 0` | 成功，Unix 时间戳（UTC 毫秒） |
| `-1` | 失败（指定服务器不可达 / 内置列表全部失败 / 网络不可用） |

#### 行为说明

- **传入非空地址**：仅查询该服务器，单次查询超时 3 秒；失败直接返回 `-1`，**不回退**内置列表。
- **传 `NULL` / 空串 / 空白**：按内置列表顺序并发查询、先到先用，返回第一个成功结果；全部失败返回 `-1`。

#### 内置服务器列表

按优先级顺序（任播/低延迟优先，海外节点兜底）：

| 服务器 | 说明 |
|--------|------|
| `ntp.aliyun.com` | 阿里云任播，全国低延迟 |
| `time.cloudflare.com` | Cloudflare 全球任播 |
| `ntp.tencent.com` | 腾讯云任播 |
| `time.windows.com` | 微软全球节点 |
| `ntp.ntsc.ac.cn` | 国家授时中心 |
| `0.pool.ntp.org` | 全球公共池 |
| `cn.ntp.org.cn` | 中国 NTP 公共池 |
| `time.google.com` | 海外高速，国内终极冗余 |

#### Python 调用示例

```python
import ctypes, datetime
from ctypes import c_char_p, c_int64

dll = ctypes.WinDLL("JadeView.dll")
dll.jade_ntp_now.argtypes = [c_char_p]
dll.jade_ntp_now.restype = c_int64

# 1) 使用内置列表（传 NULL）
ms = dll.jade_ntp_now(None)
if ms >= 0:
    print("UTC:", datetime.datetime.utcfromtimestamp(ms / 1000.0))

# 2) 指定自定义服务器
ms = dll.jade_ntp_now(b"ntp.aliyun.com")

# 3) 空串等价于内置列表
ms = dll.jade_ntp_now(b"")

# 失败返回 -1
if ms < 0:
    print("NTP 获取失败")
```

:::info
返回值为 UTC 毫秒。换算北京时间（UTC+8）：`本地毫秒 = ms + 8 * 3600 * 1000`。
:::
