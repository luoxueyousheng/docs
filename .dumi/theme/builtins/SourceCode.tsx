// 覆盖 lobehub 的 SourceCode 内置组件（Markdown ``` 代码块渲染器）。
// 原实现把代码块背景设为 rgba(colorBgLayout, 0.5)，依赖正文「卡片」(colorBgContainer) 作底色才有对比；
// 本站 Content slot 去掉了正文卡片（borderless + 透明背景），代码块直接落在 colorBgLayout 上，
// rgba(colorBgLayout, 0.5) 叠在同色页面上几乎不可见 → 代码块「没有背景色」。
// 这里改用与首页代码块一致的 colorFillQuaternary + 细边框，确保在纯色页面上清晰可辨（明暗主题自适应）。
import { Highlighter } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { memo } from 'react';

const SourceCode = memo<{ children: string; lang: string }>(({ children, lang }) => {
  const theme = useTheme();
  return (
    <Highlighter
      language={lang}
      style={{
        background: theme.colorFillQuaternary,
        border: `1px solid ${theme.colorBorderSecondary}`,
        borderRadius: theme.borderRadius,
      }}
    >
      {children}
    </Highlighter>
  );
});

export default SourceCode;
