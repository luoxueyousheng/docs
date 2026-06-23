// 移动端汉堡菜单（自定义 Drawer + Menu，不用 @lobehub/ui Burger）。
// 弃用原因：@lobehub/ui Burger 把「图标 + 抽屉」整个包在 onClick=toggle 的容器里，抽屉是 React portal，
//   点击会沿 React 树冒泡回该容器触发关闭 → 点 SubMenu 标题（本应只展开）也会把抽屉关掉。
// 自定义后：SubMenu 标题点击仅展开/收缩（antd 默认，不导航、不关抽屉）；叶子链接点击才导航并关抽屉。
import { ActionIcon } from '@lobehub/ui';
import { Drawer, Menu } from 'antd';
import { Link } from 'dumi';
import isEqual from 'fast-deep-equal';
import { MenuIcon, X } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
// @ts-ignore 主题 store / selectors
import { siteSelectors, useSiteStore } from 'dumi-theme-lobehub/dist/store';

const HEADER_H = 80; // 与 themeConfig.siteToken.headerHeight 对齐

export default memo(function JadeBurger() {
  const [opened, setOpened] = useState(false);
  const nav = useSiteStore((s: any) => s.navData, isEqual);
  const sidebar = useSiteStore((s: any) => s.sidebar, isEqual);
  const { pathname, activePath } = useSiteStore((s: any) => ({
    activePath: siteSelectors.activePath(s),
    pathname: s.location.pathname,
  }));
  const close = () => setOpened(false);

  // 当前所在区 → 可展开 SubMenu（标题纯文本，点击仅展开/收缩）；子项为文档侧栏（点击导航并关抽屉）。
  // 其它顶级项为普通链接。
  const inDocs = pathname === '/docs' || pathname.startsWith('/docs/');
  const items = useMemo(() => {
    // 文档主路由下：子菜单顶部先放「分区切换」（文档指南 / API），保证移动端也能在子分区间跳转。
    const secGroup = inDocs
      ? [
          {
            key: 'doc-sections',
            type: 'group',
            label: '文档',
            children: [
              { title: '文档指南', root: '/docs/spec' },
              { title: 'API', root: '/docs/api' },
            ].map((s) => ({
              key: `sec-${s.root}`,
              label: (
                <Link onClick={close} to={s.root}>
                  {s.title}
                </Link>
              ),
            })),
          },
        ]
      : [];

    const subChildren: any[] = [...secGroup];
    (sidebar || []).forEach((group: any, gi: number) => {
      if (!group || group.link) return;
      const children = (group.children || []).map((it: any) => ({
        key: `s-${it.link}`,
        label: (
          <Link onClick={close} to={it.link}>
            {it.title}
          </Link>
        ),
      }));
      if (group.title) subChildren.push({ key: `g-${gi}`, label: group.title, type: 'group', children });
      else subChildren.push(...children);
    });

    return nav.map((item: any) => {
      const key = item.activePath || item.link;
      // 「文档」项链接到 /docs/spec，但在整个 /docs/* 下都应展开（含 /docs/api 子分区）。
      const isDocsItem = String(item.link || '').startsWith('/docs');
      const expand = (key === activePath || (inDocs && isDocsItem)) && subChildren.length > 0;
      if (expand) {
        return { children: subChildren, key, label: item.title };
      }
      return {
        key,
        label: (
          <Link onClick={close} to={String(item.link)}>
            {item.title}
          </Link>
        ),
      };
    });
  }, [nav, activePath, sidebar, inDocs]);

  return (
    <>
      <ActionIcon icon={opened ? X : MenuIcon} onClick={() => setOpened((o) => !o)} />
      <Drawer
        closable={false}
        onClose={close}
        open={opened}
        placement="left"
        rootClassName="jade-burger"
        rootStyle={{ insetBlockStart: HEADER_H }}
        styles={{ body: { padding: 0 }, header: { display: 'none' }, mask: { background: 'transparent' } }}
        width="100vw"
      >
        <Menu
          items={items}
          mode="inline"
          selectedKeys={[
            ...new Set([
              activePath,
              `s-${pathname}`,
              pathname.startsWith('/docs/api') ? 'sec-/docs/api' : 'sec-/docs/spec',
            ]),
          ]}
          style={{ background: 'transparent', borderInlineEnd: 'none' }}
        />
      </Drawer>
    </>
  );
});
