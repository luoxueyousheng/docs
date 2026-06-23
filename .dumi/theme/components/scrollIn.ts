// 共享「滚动进入视口淡入上浮」动画（motion / whileInView variants）——首页正文区块（HomeExtra）共用。
// 比首屏 Hero 的飘带(floatIn)更克制：内容区只做 上浮 + 淡入 + 轻微去模糊，不做 3D 翻转，
// 避免长页面滚动时过度花哨、也降低重排成本。
// 用法：区块容器 <motion.section variants={scrollContainer} initial="hidden" whileInView="show" viewport={scrollViewport}>；
// 容器内的标题/卡片等加 variants={scrollItem} 即随容器错峰浮现；
// 卡片网格再套一层 variants={scrollContainer} 可让卡片在区块就位后再逐个错峰。

// 容器自身不位移，只负责给子元素排期（错峰）。
export const scrollContainer = {
  hidden: {},
  show: { transition: { delayChildren: 0.05, staggerChildren: 0.12 } },
};

// 单个元素：从下方 28px 处淡入、去除轻微模糊；easeOut tween 收尾干净、无过冲。
export const scrollItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

// once：只触发一次（滚回去不重播）；amount：元素露出约 20% 即触发，长卡片也能尽早就位。
export const scrollViewport = { once: true, amount: 0.2 } as const;
