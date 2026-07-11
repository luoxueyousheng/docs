---
order: 0
---

# Introduction

The Golang SDK (JadeViewGo) is a Go wrapper for JadeView 2.x that lets you build **cross-platform** desktop applications with Go + HTML/CSS/JS. Windows, events, bidirectional IPC, tray, dialogs, notifications, YAML persistence, JAPK resource packages and NTP time — all 124 exported functions in the header are wrapped.

The SDK's API naming follows the JadeView frontend JS API, lowering the learning cost when working across languages.

## Key Features

- **Cross-platform**: Windows (amd64 / 386 / arm64) and Linux (amd64 / arm64) share one public API — the same business code compiles for both platforms
- **Zero-dependency Windows builds**: pure Go implementation (direct syscall), with the DLL embedded via `go:embed` — only the Go toolchain is required, no MinGW/CGO, and the output is a single self-contained exe
- **Window management**: standard / borderless windows; size, position, fullscreen, always-on-top, window level, taskbar progress, Mica/Acrylic backdrops
- **IPC**: event subscription (`On`/`Off`), IPC channel handlers (`RegisterIPCHandler`), push messages (`SendIPCMessage`)
- **Dialogs**: open/save file dialogs, message boxes, error boxes — both synchronous and asynchronous APIs
- **System tray & menus**: tray icon with flat-table menus, window context menus
- **JAPK resource packages**: encrypted/obfuscated frontend bundles, loadable directly from memory (zero frontend files on disk)
- **System tools**: clipboard, system paths, display info, global hotkeys, login autostart, URL schemes, file associations, printing, encoding conversion, NTP network time
- **YAML config store**: built-in persistent configuration with key-path access
- **Type-safe enums**: two-level namespaced enums like `Theme.Dark`, `FrameStyle.TitleOverlay`, `Backdrop.Mica` — no bare strings

## Use Cases

- Desktop apps in Go (HTML/CSS/JS frontend, Go backend), shipping to Windows and Linux from one codebase
- Utility apps that need **single-file distribution** (single self-contained exe on Windows)
- Commercial apps that need encrypted frontend distribution (JAPK)
- Rapid prototypes and internal tools

## Architecture

```
┌───────────────────────────────────────────────┐
│           Go backend (single package)          │
│  windows / WebView / IPC events / dialogs /   │
│  tray / tools                                  │
└──────────┬─────────────────────┬──────────────┘
           │ Windows             │ Linux
           │ direct syscall      │ cgo static link
┌──────────┴──────────┐ ┌────────┴──────────────┐
│ JadeView.dll        │ │ libJadeView.a         │
│ (go:embed built-in) │ │ (GTK3/WebKit2GTK)     │
└──────────┬──────────┘ └────────┬──────────────┘
           │                     │
┌──────────┴─────────────────────┴──────────────┐
│        WebView2 / WebKit2GTK rendering         │
│        HTML / CSS / JavaScript (frontend UI)   │
└───────────────────────────────────────────────┘
```

## System Requirements

| Platform | Arch | Build deps | Runtime deps |
|------|------|----------|------------|
| **Windows 10 / 11** | amd64 / 386 / arm64 | Go toolchain only | WebView2 Runtime (bundled with Win11) |
| **Linux** | amd64 / arm64 | Go + gcc + GTK3 / WebKit2GTK / xdo dev packages | GTK3 / WebKit2GTK / libxdo3 + graphical desktop |

- **Go version**: Go 1.23+
- **External Go dependencies**: none (standard library only)

## Installation

```bash
go get github.com/luoxueyousheng/JadeViewGo@latest    # latest release
go get github.com/luoxueyousheng/JadeViewGo@v0.2.2    # pin a specific version
```

To try the built-in example first (a runnable module subpackage):

```bash
go run github.com/luoxueyousheng/JadeViewGo/example@v0.2.2
```

## Quick Example

```go
package main

import jadeview "github.com/luoxueyousheng/JadeViewGo"

func main() {
    jadeview.On(jadeview.EventAppReady, func(windowID uint32, data string) string {
        if windowID == 1 {
            opts := jadeview.DefaultWindowOptions()
            opts.Title = "Hello JadeView"
            jadeview.CreateWindow("https://example.com", 0, &opts, nil)
        }
        return ""
    })
    jadeview.On(jadeview.EventWindowAllClosed, func(uint32, string) string {
        jadeview.Exit()
        return ""
    })
    jadeview.Init(true, "", "", "my-app", "com.example.myapp", false)
    jadeview.RunMessageLoop()
}
```

## Project Info

- **SDK version**: v0.2.2
- **JadeView version**: v2.3.0-beta.10
- **License**: wrapper code is MIT (binaries under `lib/` are produced by the JadeView authors and not covered by MIT)
- **Source**: [GitHub](https://github.com/luoxueyousheng/JadeViewGo)
