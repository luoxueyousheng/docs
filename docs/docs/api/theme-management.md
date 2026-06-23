---
title: 主题管理
order: 2
group:
  title: 窗口与视图
  order: 1
---

# 主题管理

**用途**：控制窗口是**浅色 / 深色 / 跟随系统**，以及在 Windows 11 上是否使用 **Mica、亚克力**等系统背景效果；也可直接设**背景色字符串**。2.0 里主题名都是 **字符串**（`Light` / `Dark` / `System`），不再使用旧头文件里的枚举类型名。

---

<h2 id="window-theme">窗口明暗主题</h2>

对应 API：**`set_window_theme`**、**`get_window_theme`**。**用途**：切换或查询当前窗口（及内嵌 WebView）的**明暗主题**。

```c
int32_t set_window_theme(uint32_t window_id, const char* theme);
int32_t get_window_theme(uint32_t window_id);
```

`theme`：`"Light"`、`"Dark"`、`"System"` 或 `NULL`（由库给默认）。

:::info{title=平台支持}
Windows 与 Linux 均可用。`"System"`（跟随系统）在 Linux 下通过 **XDG 桌面门户** `org.freedesktop.appearance` 读取，回退 `gsettings`。
Windows 的**沉浸式暗色原生标题栏**在 Linux 无对应——Linux 标题栏为 HTML 自绘，明暗由你的页面 CSS 跟随主题即可。
:::

---

## 设置窗口背景材质（`set_window_backdrop`）

**用途**：在 **Windows 11** 上给窗口加上系统提供的**背景材质**（如云母、亚克力），和系统设置里「个性化」那类效果一致。`backdrop_type` 常用取值：**`mica`**、**`micaAlt`**、**`acrylic`**（小写驼峰，与系统 DWM API 一致）。

```c
int32_t set_window_backdrop(uint32_t window_id, const char* backdrop_type);
```

:::warning{title=平台差异}
**仅 Windows 11**。Linux（WebKitGTK）无系统材质等价物，调用为 no-op 并返回 `0`。Linux 上请改用 `set_window_background_color` 设纯色，或窗口 `transparent` + 页面半透明背景。
:::

---

## 设置窗口背景色（`set_window_background_color`）

**用途**：用 **十六进制颜色**（如 `#RRGGBB`）填窗口背景，不依赖 Mica。

```c
int32_t set_window_background_color(uint32_t window_id, const char* background_color_hex);
```

---

## 创建窗口时顺带指定

在 **`WebViewWindowOptions.theme`** 里填初始主题，见 [核心 API](/docs/api/index#webview-window-options)。
