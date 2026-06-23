// 文档主路由（/docs/*）面包屑：用 antd 自带 <Breadcrumb>（https://ant.design/components/breadcrumb-cn）。
// 层级：文档 / <分区:文档指南|API> / <当前页标题>。仅 /docs/* 显示；其它文档区（SDK、发行版本等）不渲染。
// 由 DocumentLayout 作为 <Docs> 的首个子节点注入 → 落在正文 <Content> 顶部、页面 H1 之上，并随正文居中对齐。
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
// @ts-ignore 主题 store，深层路径无类型声明
import { useSiteStore } from 'dumi-theme-lobehub/dist/store/useSiteStore';

const SECTIONS: Record<string, { title: string; root: string }> = {
  spec: { title: '文档指南', root: '/docs/spec' },
  api: { title: 'API', root: '/docs/api' },
};

export default memo(function DocBreadcrumb() {
  const { pathname } = useLocation();
  const title = useSiteStore((s: any) => s.routeMeta?.frontmatter?.title, isEqual);

  if (!(pathname === '/docs' || pathname.startsWith('/docs/'))) return null;

  const seg = pathname.split('/')[2]; // spec | api
  const sec = SECTIONS[seg];

  const items: { title: React.ReactNode }[] = [{ title: <Link to="/docs/spec">文档</Link> }];
  if (sec) {
    const atRoot = pathname === sec.root;
    items.push({ title: atRoot ? sec.title : <Link to={sec.root}>{sec.title}</Link> });
    if (!atRoot && title) items.push({ title });
  }

  return <Breadcrumb items={items} style={{ marginBottom: 16, fontSize: 14 }} />;
});
