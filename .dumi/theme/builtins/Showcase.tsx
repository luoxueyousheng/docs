// 产品案例展示（从旧站 src/pages/showcase.jsx 迁移）：用新站风格重做——
//   lobehub/antd 设计 token + motion「滚动错峰浮现」（与首页 HomeExtra 同一套 scrollIn），
//   卡片悬停微抬 + 图片缓慢放大；右上角玻璃徽标标注生态属性。
// 由 docs/showcase.md 以 <Showcase /> 内嵌（sidebar:false / toc:false，全宽居中呈现）。
// 新增本地 builtin 需重启 dumi dev 才会被扫描注册（见 .dumi/tmp/appData.json 的别名表）。
import { createStyles } from 'antd-style';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { memo } from 'react';
import { scrollContainer, scrollItem, scrollViewport } from '../components/scrollIn';

const BRAND = '#007ee5';

type CaseItem = { name: string; desc: string; link: string; image: string; badge?: string };

// 案例数据（沿用旧站；图片复制到 public/showcase/）。后续新增案例直接往这里加对象即可，网格自适应。
const cases: CaseItem[] = [
  {
    name: 'Electron asar GUI 工具',
    desc: '一款简洁易用的 Electron asar 文件打包 / 解包工具，图形界面操作，开箱即用。',
    link: 'https://github.com/HyJunYaa/Electron-asar-Gui-Tool',
    image: '/showcase/electron-asar.jpg',
    badge: '社区生态',
  },
  {
    name: 'Jade EC 查看器',
    desc: '易语言 .ec 模块文件现代化查看器，支持浏览子程序、DLL 命令、类、自定义数据类型、全局变量与常量；三栏布局、亚克力背景、深浅主题与多维度搜索。',
    link: 'https://github.com/tuyangJs/Jade_ec',
    image: '/showcase/jade-ec.jpg',
  },
];

const useStyles = createStyles(({ css, token, responsive }) => ({
  root: css`
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
  `,
  header: css`
    margin-bottom: 36px;
  `,
  title: css`
    margin: 0 0 10px;

    font-size: 44px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: ${token.colorText};

    ${responsive.mobile} {
      font-size: 30px;
    }
  `,
  subtitle: css`
    margin: 0;
    font-size: 19px;
    color: ${token.colorTextSecondary};

    ${responsive.mobile} {
      font-size: 16px;
    }
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 24px;
  `,
  card: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;

    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;

    background: ${token.colorBgContainer};

    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: ${token.colorBorder};
      box-shadow: ${token.boxShadow};
    }
    &:hover .jade-case-img {
      transform: scale(1.04);
    }
  `,
  media: css`
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 10;

    background: ${token.colorFillQuaternary};
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  img: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;

    transition: transform 0.6s ease;
  `,
  // 右上角玻璃徽标：底色偏不透明（卡片在动画/悬停期间带 transform，会掐断 backdrop blur，
  // 故不依赖模糊也要清晰可读；blur 仅作锦上添花）。
  badge: css`
    position: absolute;
    top: 12px;
    right: 12px;

    padding: 4px 12px;
    border-radius: 999px;

    font-size: 12px;
    font-weight: 600;
    color: ${token.colorText};

    background: color-mix(in srgb, ${token.colorBgElevated} 86%, transparent);
    border: 1px solid ${token.colorBorderSecondary};
    backdrop-filter: saturate(180%) blur(12px);
    -webkit-backdrop-filter: saturate(180%) blur(12px);
  `,
  body: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 20px 22px 22px;
  `,
  name: css`
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 600;
    color: ${token.colorText};
  `,
  desc: css`
    flex: 1;
    margin: 0 0 18px;

    font-size: 14px;
    line-height: 1.75;
    color: ${token.colorTextSecondary};
  `,
  cta: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 42px;
    border-radius: 999px;

    font-size: 15px;
    font-weight: 500;
    color: #fff !important;
    text-decoration: none !important;

    background: ${BRAND};
    transition: background 0.2s ease;

    &:hover {
      color: #fff;
      background: #0a6fc2;
    }
  `,
}));

export default memo(function Showcase() {
  const { styles, cx } = useStyles();
  const reduce = useReducedMotion();
  const reveal = reduce
    ? {}
    : ({ initial: 'hidden', whileInView: 'show', viewport: scrollViewport } as const);

  return (
    <div className={styles.root}>
      <motion.div className={styles.header} variants={scrollContainer} {...reveal}>
        <motion.h1 className={styles.title} variants={scrollItem}>
          Built with JadeView.
        </motion.h1>
        <motion.p className={styles.subtitle} variants={scrollItem}>
          卓越的高性能应用，汇聚现代原生美学。
        </motion.p>
      </motion.div>

      <motion.div className={styles.grid} variants={scrollContainer} {...reveal}>
        {cases.map((c) => (
          <motion.div
            key={c.name}
            className={styles.card}
            variants={scrollItem}
            whileHover={reduce ? undefined : { y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <div className={styles.media}>
              <img alt={c.name} className={cx(styles.img, 'jade-case-img')} loading="lazy" src={c.image} />
              {c.badge && <span className={styles.badge}>{c.badge}</span>}
            </div>
            <div className={styles.body}>
              <h2 className={styles.name}>{c.name}</h2>
              <p className={styles.desc}>{c.desc}</p>
              <a className={styles.cta} href={c.link} rel="noreferrer" target="_blank">
                获取应用 <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});
