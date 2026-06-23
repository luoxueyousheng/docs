// 覆盖 lobehub 的 DocLayout 入口。覆盖它的唯一原因：要替换其内部「相对引入」的 DocumentLayout
//   （node_modules 里 index.js 写死 `import DocumentLayout from "./DocumentLayout"`，无法单独覆盖
//    那个嵌套模块，只能整个 layouts/DocLayout 入口覆盖）。
//
// 本文件 = 原版 index.js 的等价复刻：Provider(store) + 各 Head + StoreUpdater + ThemeProvider +
//   GlobalStyle，全部从 `dumi-theme-lobehub/dist/*` 原样复用；仅把 DocumentLayout 换成同目录下
//   我们的定制版（相对 ./DocumentLayout），后者给侧栏显隐加了 motion 动画。
import { useLocale, useLocation, useNavData, useOutlet, useRouteMeta, useSidebarData, useSiteData, useTabMeta } from 'dumi';
import { memo } from 'react';
// @ts-ignore 主题内部组件，深层路径无类型声明
import { StoreUpdater } from 'dumi-theme-lobehub/dist/components/StoreUpdater';
// @ts-ignore
import { Provider, createStore } from 'dumi-theme-lobehub/dist/store';
// @ts-ignore
import GlobalStyle from 'dumi-theme-lobehub/dist/layouts/DocLayout/GlobalStyle';
// @ts-ignore
import ThemeProvider from 'dumi-theme-lobehub/dist/layouts/DocLayout/ThemeProvider';
// @ts-ignore
import Analytics from 'dumi-theme-lobehub/dist/layouts/DocLayout/Head/Analytics';
// @ts-ignore
import Favicons from 'dumi-theme-lobehub/dist/layouts/DocLayout/Head/Favicons';
// @ts-ignore
import Og from 'dumi-theme-lobehub/dist/layouts/DocLayout/Head/Og';
// @ts-ignore
import StructuredData from 'dumi-theme-lobehub/dist/layouts/DocLayout/Head/StructuredData';
// 同目录定制 DocumentLayout（含侧栏 motion 显隐动画）
import DocumentLayout from './DocumentLayout';

const DocProvider = memo(function DocProvider({ children }: any) {
  const siteData = useSiteData();
  const sidebar = useSidebarData();
  const routeMeta = useRouteMeta();
  const tabMeta = useTabMeta();
  const navData = useNavData();
  const location = useLocation();
  const locale = useLocale();
  return (
    <Provider
      createStore={() =>
        // @ts-ignore 与原版一致的 store 初始化
        createStore({ locale, location, navData, routeMeta, sidebar, siteData, tabMeta })
      }
    >
      <Favicons />
      <Og />
      <Analytics />
      <StructuredData />
      <StoreUpdater />
      <ThemeProvider>
        <GlobalStyle />
        <DocumentLayout>{children}</DocumentLayout>
      </ThemeProvider>
    </Provider>
  );
});

export default memo(function DocLayout() {
  const outlet = useOutlet();
  return <DocProvider>{outlet}</DocProvider>;
});
