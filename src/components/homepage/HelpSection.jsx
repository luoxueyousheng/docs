import React from 'react';

export default function HelpSection({ className }) {
  return (
    <section className={className || ''} style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--ifm-heading-font-family)', fontWeight: 700, fontSize: '2rem', marginBottom: '1rem', color: 'var(--jv-text-primary)' }}>需要帮助？</h2>
      <p style={{ color: 'var(--jv-text-tertiary)', fontSize: '1rem', lineHeight: 1.8 }}>
        加入 QQ 群 <strong>703623743</strong> 获取技术支持，或在 <a href="https://github.com/JadeViewDocs/JadeView/issues" style={{ color: 'var(--jv-blue-200)' }}>GitHub Issues</a> 提交问题。
      </p>
    </section>
  );
}