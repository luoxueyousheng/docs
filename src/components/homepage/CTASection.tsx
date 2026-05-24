import { useEffect, useRef, useState } from "react";
import { AnimatedTetrahedron } from "@site/src/components/homepage/animated-tetrahedron";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`
            }}
          />
          
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                  使用 JadePack
                  <br />
                  保护你的资源
                </h2>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  JadePack 是 JadeView 官方发行的图形化桌面客户端，用于 JAPK 资源包的构建、混淆与签名保护。
                  提供 Ed25519 签名 + AES-256-GCM 加密的完整安全方案。
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <a
                    href="https://store.jade.run/downloads/jadepack/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group font-medium transition-colors"
                  >
                    下载 JadePack
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                  <a
                    href="/v2api/jadepack"
                    className="inline-flex items-center h-14 px-8 text-base rounded-full border border-foreground/20 hover:bg-foreground/5 font-medium transition-colors"
                  >
                    查看文档
                  </a>
                </div>

                <p className="text-sm text-muted-foreground mt-8 font-mono">
                  Windows 10 / 11  ·  图形化工具
                </p>
              </div>

              <div className="hidden lg:flex items-center justify-center w-[500px] h-[500px] -mr-16">
                <AnimatedTetrahedron />
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}