// 共享「飘带飘入」动画（framer-motion variants）——首屏 Hero 与标题栏胶囊共用，保证两处效果一致。
// 飘带感 = 3D 旋转(以底边为轴 rotateX 掀起→展平) + 微侧倾 rotateZ + 上飘 + 缩放 + 雾化，
// 配合欠阻尼 spring(轻微过冲摇曳)；淡入/去模糊用平滑 tween(防止 blur 被弹成负值)。
// 用法：容器加 floatContainer 做错峰；每个子元素加 floatItem 变体 + floatStyle(透视/旋转轴)。

// 透视 + 旋转轴：rotateX 才有 3D 翻起的纵深；以底边为轴 → 像绸带从下掀起就位。
export const floatStyle = { transformPerspective: 1000, transformOrigin: 'center bottom' } as const;

export const floatContainer = {
  hidden: {},
  show: { transition: { delayChildren: 0.12, staggerChildren: 0.2 } },
};

const spring = { type: 'spring', stiffness: 46, damping: 11, mass: 1.1 } as const;

export const floatItem = {
  hidden: { opacity: 0, y: 56, rotateX: 48, rotateZ: -4, scale: 0.96, filter: 'blur(14px)' },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateZ: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...spring,
      opacity: { duration: 0.8, ease: 'easeOut' },
      filter: { duration: 0.9, ease: 'easeOut' },
    },
  },
};

// 无 filter 版本：用于「自身带 backdrop-filter 的元素」（如标题栏胶囊）。
// 若用带 filter 的版本，元素自身的 filter 会干扰它自己的 backdrop-filter（背景模糊失效）；
// 故这里只做 3D 旋转/位移/缩放/淡入的飘入，不做内容雾化，背景模糊得以保留。
export const floatItemNoBlur = {
  hidden: { opacity: 0, y: 56, rotateX: 48, rotateZ: -4, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateZ: 0,
    scale: 1,
    transition: { ...spring, opacity: { duration: 0.8, ease: 'easeOut' } },
  },
};
