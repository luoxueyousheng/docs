import { useEffect, useState, useRef } from "react";

const locations = [
  { city: "TypeScript", region: "Web SDK", latency: "v2.0", href: "/web-sdk" },
  { city: "Python", region: "Python SDK", latency: "v1.5", href: "/python-sdk2" },
  { city: "易语言", region: "易语言 SDK", latency: "v1.2", href: "/sdks" },
  { city: "火山视窗", region: "火山 SDK", latency: "v1.0", href: "/sdks" },
  { city: "C/C++", region: "C API", latency: "Native" },
];

function getVersion(city: string, ts: string, py: string, vol: string, e: string, fallback: string) {
  if (city === "TypeScript") return ts;
  if (city === "Python") return py;
  if (city === "火山视窗") return vol;
  if (city === "易语言") return e;
  return fallback;
}

function getRegion(city: string, vol: string, e: string, fallback: string) {
  if (city === "火山视窗") return vol;
  if (city === "易语言") return e;
  return fallback;
}

export function SDKsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tsVersion, setTsVersion] = useState("v2.0");
  const [pyVersion, setPyVersion] = useState("v1.5");
  const [volVersion, setVolVersion] = useState("v1.0");
  const [eVersion, setEVersion] = useState("v1.2");
  const [volRegion, setVolRegion] = useState("火山 SDK");
  const [eRegion, setERegion] = useState("易语言 SDK");
  const sectionRef = useRef<HTMLElement>(null);

  // 从 npm registry 获取 TypeScript SDK 最新版本号
  useEffect(() => {
    fetch("https://registry.npmjs.org/jadeview-ipc-types/latest")
      .then((res) => res.json())
      .then((data) => {
        if (data.version) setTsVersion(`v${data.version}`);
      })
      .catch(() => undefined);
  }, []);

  // 从 PyPI 获取 Python SDK 最新版本号
  useEffect(() => {
    fetch("https://pypi.org/pypi/jadeview/json")
      .then((res) => res.json())
      .then((data) => {
        if (data.info?.version) setPyVersion(`v${data.info.version}`);
      })
      .catch(() => undefined);
  }, []);

  // 从 GitHub 获取火山视窗 SDK 最新版本号，失败回退 Gitee API（避免 CORS）
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/JadeViewDocs/JadeView/main/SDK/Vol_SDK/Info.json")
      .then((res) => {
        if (!res.ok) throw new Error("GitHub fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.changelog?.[0]?.version) setVolVersion(`v${data.changelog[0].version}`);
        if (data.title) setVolRegion(data.title);
      })
      .catch(() => {
        fetch("https://gitee.com/api/v5/repos/ilinxuan/JadeView_library/contents/SDK/Vol_SDK/Info.json")
          .then((res) => res.json())
          .then((data) => {
            if (!data.content) return;
            const parsed = JSON.parse(atob(data.content.replace(/\n/g, '')));
            if (parsed.changelog?.[0]?.version) setVolVersion(`v${parsed.changelog[0].version}`);
            if (parsed.title) setVolRegion(parsed.title);
          })
          .catch(() => undefined);
      });
  }, []);

  // 从 GitHub 获取易语言 SDK 最新版本号，失败回退 Gitee API（避免 CORS）
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/JadeViewDocs/JadeView/main/SDK/e_Sdk/Info.json")
      .then((res) => {
        if (!res.ok) throw new Error("GitHub fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.changelog?.[0]?.version) setEVersion(`v${data.changelog[0].version}`);
        if (data.title) setERegion(data.title);
      })
      .catch(() => {
        fetch("https://gitee.com/api/v5/repos/ilinxuan/JadeView_library/contents/SDK/e_Sdk/Info.json")
          .then((res) => res.json())
          .then((data) => {
            if (!data.content) return;
            const parsed = JSON.parse(atob(data.content.replace(/\n/g, '')));
            if (parsed.changelog?.[0]?.version) setEVersion(`v${parsed.changelog[0].version}`);
            if (parsed.title) setERegion(parsed.title);
          })
          .catch(() => undefined);
      });
  }, []);

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
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              SDK 生态
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              选择 SDK，
              <br />
              开始集成。
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              多语言封装共享同一套原生能力。JS、Python、易语言、火山视窗 —— 按你的技术栈选型即可，接口统一，文档对齐。
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">5</div>
                <div className="text-sm text-muted-foreground">语言 SDK</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">C API</div>
                <div className="text-sm text-muted-foreground">原生接口</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">DLL+Lib</div>
                <div className="text-sm text-muted-foreground">双库发布</div>
              </div>
            </div>
          </div>

          {/* Right: Location list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">SDK 列表</span>
                <span className="flex items-center gap-2 text-xs font-mono text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  全部可用
                </span>
              </div>

              {/* Locations */}
              <div>
                {locations.map((location, index) => {
                  const rowClass = `px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                    hoveredIndex === index ? "bg-foreground/[0.02]" : ""
                  }`;
                  const inner = (
                    <>
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            hoveredIndex === index ? "bg-foreground" : "bg-foreground/20"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{location.city}</div>
                          <div className="text-sm text-muted-foreground">{getRegion(location.city, volRegion, eRegion, location.region)}</div>
                        </div>
                      </div>
                      <span className="font-mono text-sm text-muted-foreground">
                        {getVersion(location.city, tsVersion, pyVersion, volVersion, eVersion, location.latency)}
                      </span>
                    </>
                  );
                  return location.href ? (
                    <a
                      key={location.city}
                      href={location.href}
                      className={rowClass}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div
                      key={location.city}
                      className={rowClass}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}