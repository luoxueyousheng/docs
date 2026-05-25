import { useState, useEffect } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function Navigation() {
  const { siteConfig } = useDocusaurusContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 从 Docusaurus 导航栏配置动态读取链接
  const navbarItems = ((siteConfig as any).themeConfig?.navbar?.items || []) as any[];
  const navItems = navbarItems
    .filter((item: any) => item.to && item.label && item.type !== "search")
    .map((item: any) => ({ name: item.label, href: item.to }));

  const ctaItem = navItems.find((item: any) => item.name === "快速开始");
  const navLinks = navItems.filter((item: any) => item.name !== "快速开始");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <span
              className={`font-display tracking-tight transition-all duration-500 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              JadeView
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/JadeViewDocs/JadeView"
              className={`text-foreground/70 hover:text-foreground transition-all duration-500 ${
                isScrolled ? "text-xs" : "text-sm"
              }`}
            >
              GitHub
            </a>
            <a
              href={ctaItem?.href || "/spec/quickstart"}
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 inline-flex items-center justify-center ${
                isScrolled ? "px-4 h-8 text-xs" : "px-6 h-10 text-sm"
              }`}
            >
              快速开始
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* 关闭按钮 */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
          <div className="flex-1 flex flex-col justify-center divide-y divide-foreground/10">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 py-6 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div
            className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <a
              href="https://github.com/JadeViewDocs/JadeView"
              className="flex-1 rounded-full h-14 text-base border border-foreground/20 hover:bg-foreground/5 inline-flex items-center justify-center transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GitHub
            </a>
            <a
              href={ctaItem?.href || "/spec/quickstart"}
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base inline-flex items-center justify-center transition-colors hover:bg-foreground/90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              快速开始
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}