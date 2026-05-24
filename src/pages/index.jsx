import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Navigation } from '@site/src/components/homepage/Navigation';
import { HeroSection } from '@site/src/components/homepage/HeroSection';
import { FeaturesSection } from '@site/src/components/homepage/FeaturesSection';
import { HowItWorksSection } from '@site/src/components/homepage/HowItWorksSection';
import { DevelopersSection } from '@site/src/components/homepage/MetricsSection';
import { SDKsSection } from '@site/src/components/homepage/SDKsSection';
import { TechStackSection } from '@site/src/components/homepage/TechStackSection';
import { ArchitectureSection } from '@site/src/components/homepage/ArchitectureSection';
import { ApiSection } from '@site/src/components/homepage/ApiSection';
import { DistributionSection } from '@site/src/components/homepage/DistributionSection';
import { CtaSection } from '@site/src/components/homepage/CTASection';


function ThemeFixer() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);
  return null;
}

export default function Homepage() {
  return (
    <Layout
      title="JadeView - 面向 Windows 的通用 WebView 宿主库"
      wrapperClassName="homepage"
    >
      <Head>
        <title>JadeView - 面向 Windows 的通用 WebView 宿主库</title>
        <meta
          name="description"
          content="JadeView 是一个基于 Rust 开发的 WebView 窗口库，提供 DLL 动态库和 Lib 静态库。轻量、高性能、接口清晰。"
        />
        <style>{`
          .navbar { display: none !important; }
          .main-wrapper { padding-top: 0 !important; }
        `}</style>
      </Head>

      <BrowserOnly>{() => <ThemeFixer />}</BrowserOnly>

      <div className="homepage-wrapper">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DevelopersSection />
        <SDKsSection />
        <TechStackSection />
        <ArchitectureSection />
        <ApiSection />
        {/* <TestimonialsSection /> */}
        <DistributionSection />
        <CtaSection />
      </div>
    </Layout>
  );
}