import React from 'react';
import { FooterSection } from '@site/src/components/homepage/FooterSection';
import Docsly from '@docsly/react';
import { useLocation } from '@docusaurus/router';
import Head from '@docusaurus/Head';

export default function FooterWrapper() {
  const { pathname } = useLocation();

  return (
    <>
      <Head>
        {/**
         * Doing it this way because importing css in docusaurus
         * reorders the css clases that messes up the docsly styling
         */}
        <link rel="stylesheet" href="/assets/css/docsly.min.css" />
        <link rel="stylesheet" href="/homepage-tailwind.css" />
        <link rel="stylesheet" href="/homepage-fonts.css" />
      </Head>

      <FooterSection />

      <Docsly
        publicId="public_vzrAqhBkB7RSYu2xJ73FVYrZDBZwryg2Lkr4mluOpjUbbyp4PqVGZbs35RR6py6U"
        pathname={pathname}
      />
    </>
  );
}
