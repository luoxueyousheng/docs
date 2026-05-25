import { useState, useEffect, useRef } from "react";

// Inline SVG icons
function CopyIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
}
function CheckIcon() {
  return <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
}

const codeExamples = [
  {
    label: "创建窗口",
    code: `#include "jadeview.h"

WebViewWindowOptions opts = {
    .title = "我的应用",
    .width = 1024,
    .height = 768,
    .resizable = 1
};

uint32_t win = create_webview_window(
    "https://myapp.com", 0, &opts, NULL
);`,
  },
  {
    label: "IPC 通信",
    code: `// 前端调用后端 API
const result = await jade.invoke(
    'getData', { key: 'value' }
);

// 前端监听后端事件
jade.on('backend-event', (data) => {
    console.log('收到:', data);
});`,
  },
  {
    label: "事件发送",
    code: `// 后端 C API 发送事件
const char* data = "{\\"status\\": \\"ok\\"}";

int ret = send_event(
    window_id,
    "backend-event",
    jade_text_create(data)
);

// 返回结果给前端
return jade_text_create(reply);`,
  },
];

const features = [
  { title: "C 语言接口", description: "稳定的 ABI，多种语言与框架均可嵌入调用。" },
  { title: "IPC < 1ms 延迟", description: "自定义协议通信，>800 请求/秒高吞吐量。" },
  { title: "多语言支持", description: "JS、Python、易语言、火山视窗 SDK。" },
  { title: "~3MB 运行时", description: "轻量高效，不含 Node.js，启动仅需 16ms。" },
];

const codeAnimationStyles = `
  .dev-code-line {
    opacity: 0;
    transform: translateX(-8px);
    animation: devLineReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes devLineReveal {
    to { opacity: 1; transform: translateX(0); }
  }
  .dev-code-char {
    opacity: 0;
    filter: blur(8px);
    animation: devCharReveal 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes devCharReveal {
    to { opacity: 1; filter: blur(0); }
  }
`;

export function ApiSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="developers" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: codeAnimationStyles }} />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              API 接口
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              C 语言兼容<br /><span className="text-muted-foreground">宿主接口。</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              简洁的初始化、窗口与事件模型，可在多种语言与框架中嵌入调用。接口稳定，文档完善。
            </p>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={feature.title} className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`lg:sticky lg:top-32 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="border border-foreground/10">
              <div className="flex items-center border-b border-foreground/10">
                {codeExamples.map((example, idx) => (
                  <button key={example.label} type="button" onClick={() => setActiveTab(idx)}
                    className={`px-6 py-4 text-sm font-mono transition-colors relative ${activeTab === idx ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {example.label}
                    {activeTab === idx && <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />}
                  </button>
                ))}
                <div className="flex-1" />
                <button type="button" onClick={handleCopy} className="px-4 py-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy code">
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="p-8 font-mono text-sm bg-foreground/[0.01] min-h-[220px]">
                <pre className="text-foreground/80">
                  {codeExamples[activeTab].code.split('\n').map((line, lineIndex) => (
                    <div key={`${activeTab}-${lineIndex}`} className="leading-loose dev-code-line" style={{ animationDelay: `${lineIndex * 80}ms` }}>
                      <span className="inline-flex">
                        {line.split('').map((char, charIndex) => (
                          <span key={`${activeTab}-${lineIndex}-${charIndex}`} className="dev-code-char"
                            style={{ animationDelay: `${lineIndex * 80 + charIndex * 15}ms` }}>
                            {char === ' ' ? '\u00A0' : char}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm">
              <a href="/v2api" className="text-foreground hover:underline underline-offset-4">浏览 API 文档</a>
              <span className="text-foreground/20">|</span>
              <a href="https://github.com/JadeViewDocs/JadeView" className="text-muted-foreground hover:text-foreground">GitHub 源码</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}