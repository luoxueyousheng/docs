/**
 * v2api 文档侧栏。
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  api2PreviewSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: '核心Api',
    },
    {
      type: 'doc',
      id: 'system-api',
      label: '系统集成Api',
    },
    {
      type: 'doc',
      id: 'tools-api',
      label: '工具Api',
    },
    {
      type: 'category',
      label: '窗口相关',
      items: ['window-api', 'theme-management'],
    },
    {
      type: 'doc',
      label: 'WebView 相关',
      id: 'webview-api',
    },
    {
      type: 'category',
      label: '通信与事件',
      items: ['ipc-api', 'event-types'],
    },
    {
      type: 'category',
      label: 'JAPK 资源包',
      items: ['japk', 'jadepack', 'japk-load-memory'],
    },
    {
      type: 'doc',
      label: '本地协议服务',
      id: 'local-server-api',
    },
    {
      type: 'category',
      label: '右键菜单',
      items: ['context-menu-api', 'context-menu-items'],
    },
    {
      type: 'doc',
      id: 'tray-api',
      label: '托盘Api',
    },
    {
      type: 'doc',
      id: 'notification',
      label: '通知Api',
    },
    {
      type: 'doc',
      id: 'dialog-api',
      label: '对话框Api',
    },
    {
      type: 'category',
      label: '前端API',
      items: ['JavaScript-API', 'window-styling', 'dialog-frontend-api'],
    },
  ],
};

module.exports = sidebars;
