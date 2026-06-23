// 覆盖 lobehub 的 Content slot：去掉文档正文的「卡片」外观（填充背景 / 阴影 / 圆角），
// 让正文与整页同色、铺平（参考 lobehub.com 文档页）。
//
// 实现：沿用主题原结构（Flexbox > Block > Skeleton + Typography + ContentFooter），
//   仅把 <Block> 由默认 `variant='filled' + shadow` 改成 `variant='borderless' + shadow={false}`，
//   即无背景 / 无边框 / 无阴影；并复用主题 Content 的 styles.content（保留 badge / 表格等正文样式）。
// 导入约束：本地 slot 不引用 `dumi/theme/*` 子路径别名（会致 dev 'dumi' 解析报错），
//   主题内部组件 / 样式一律走 `dumi-theme-lobehub/dist/*`。
import { Block, Typography } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { useResponsive } from 'antd-style';
import { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
// @ts-ignore 主题内部组件 / 样式，深层路径无类型声明
import ContentFooter from 'dumi-theme-lobehub/dist/slots/ContentFooter';
// @ts-ignore
import { styles } from 'dumi-theme-lobehub/dist/slots/Content/style';
// @ts-ignore
import { useSiteStore } from 'dumi-theme-lobehub/dist/store/useSiteStore';

export default memo(function Content({ children, ...props }: any) {
  const loading = useSiteStore((s: any) => s.siteData.loading);
  const { mobile } = useResponsive();

  useEffect(() => {
    document.body.scrollTo(0, 0);
  }, [loading]);

  return (
    <Flexbox gap={mobile ? 0 : 24} width="100%" {...props}>
      <Block
        className={styles.content}
        shadow={false}
        style={{ padding: mobile ? '8px 16px' : 0, background: 'transparent' }}
        variant="borderless"
      >
        <Skeleton active loading={loading} paragraph />
        <Typography headerMultiple={0.5} style={{ display: loading ? 'none' : undefined }}>
          {children}
        </Typography>
      </Block>
      <ContentFooter />
    </Flexbox>
  );
});
