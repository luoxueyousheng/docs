import { useEffect, useState, useRef } from "react";

const developers = [
  {
    name: "Tuyang",
    avatar: "/avatar/B.jpg",
    bio: "JadeView 核心架构师，负责 Rust 核心库开发 与 IPC 通信协议设计。",
    homepage: "https://github.com/tuyangJs",
  },
  {
    name: "花生",
    avatar: "/avatar/D.jpg",
    bio: "全能型开发者，负责 JadeView 项目的对外宣传与维护。",
    homepage: "https://github.com/245867",
  },
  {
    name: "落雪有声",
    avatar: "/avatar/C.jpg",
    bio: "火山视窗SDK核心开发者，负责适配火山视窗 API。",
    homepage: "https://github.com/luoxueyousheng",
  },
  {
    name: "哪有不湿鞋",
    avatar: "/avatar/A.jpg",
    bio: "易语言SDK核心开发者，负责适配易语言模块维护。",
    homepage: "https://github.com/a657938016",
  },
  {
    name:"青舟",
    avatar: "/avatar/Q.jpg",
    bio: "全栈开发者，负责Python SDK2的开发及维护",
    homepage: "https://github.com/lazyso",
  }
];



function DeveloperCard({
  dev,
  index,
  isVisible,
}: {
  dev: (typeof developers)[0];
  index: number;
  isVisible: boolean;
}) {
  return (
    <a
      href={dev.homepage}
      target="_blank"
      rel="noopener noreferrer"
      className={`group bg-background p-8 lg:p-10 transition-all duration-700 hover:bg-foreground/[0.03] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <img
          src={dev.avatar}
          alt={dev.name}
          className="shrink-0 w-14 h-14 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-xl font-display mb-2 group-hover:translate-x-1 transition-transform duration-300">
            {dev.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {dev.bio}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            {dev.homepage.replace("https://", "")}
          </span>
        </div>
      </div>
    </a>
  );
}

export function DevelopersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section
      id="developers"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-y border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-22">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            开发委员会
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
             JadeView
            <br />
            <span className="text-muted-foreground">核心开发者</span>
          </h2>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
          {developers.map((dev, index) => (
            <DeveloperCard
              key={dev.name}
              dev={dev}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}