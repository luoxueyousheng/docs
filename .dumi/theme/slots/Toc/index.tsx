// 覆盖 lobehub 的 Toc slot：修复右侧目录点击锚点不滚动的问题。
//
// 根因：lobehub 原版给 antd <Anchor> 传 getContainer={() => document.body}，
// 而本站文档区是「窗口滚动」（滚动元素为 <html>/documentElement，body 不滚动）。
// antd 的 scrollTo 工具对非 window/Document 的容器执行 `container.scrollTop = y`，
// 即 `document.body.scrollTop = y`，在标准模式下对 body 设置 scrollTop 无效 → 页面不动。
//
// 修复：getContainer 返回 window（antd 默认值）。此时 antd 走 window.scrollTo 分支，
// 偏移量也按视口计算，滚动与「滚动高亮当前条目」均恢复正常。
//
// 其余逻辑与 lobehub 原版保持一致（dist/slots/Toc/index.js）。
import { Toc as LobeToc } from '@lobehub/ui';
import { useResponsive, useTheme } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useEffect, useState } from 'react';
// @ts-ignore 复用 lobehub 内部 store（与主题同一实例），该深层路径无类型声明
import { siteSelectors, useSiteStore } from 'dumi-theme-lobehub/dist/store';

const GAP = 48;

export default memo(function Toc() {
  const items = useSiteStore(siteSelectors.tocAnchorItem, isEqual);
  const { mobile } = useResponsive();
  const theme = useTheme() as any;
  const hash = useSiteStore((s: any) => s.location.hash, isEqual);
  const [spacing, setSpacing] = useState(GAP);

  useEffect(() => {
    const apiTitle = document?.querySelector('#api-header');
    if (apiTitle) setSpacing(apiTitle.clientHeight + GAP);
  }, [hash, items]);

  if (!items || items.length < 1) return null;

  return (
    <>
      {!mobile && <div style={{ height: spacing }} />}
      <LobeToc
        // 关键修复：窗口滚动容器用 window，而非 document.body
        getContainer={() => window as any}
        headerHeight={theme.headerHeight}
        isMobile={mobile}
        items={items}
        tocWidth={theme.tocWidth}
      />
    </>
  );
});
