import React from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@/hooks/useTheme";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  structuredData?: object;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Aryan Dudharejiya | MERN Stack Developer Portfolio",
  description = "Professional portfolio of Aryan Dudharejiya, a MERN stack developer specializing in building high-performance web applications with React, Node.js, Express, and MongoDB.",
  keywords = "MERN stack, web developer, React developer, Node.js developer, portfolio, frontend developer, backend developer, fullstack developer",
  author = "Aryan Dudharejiya",
  ogType = "website",
  ogUrl = "https://aryandudharejiya-portfolio.replit.app",
  ogImage = "/images/portfolio-og-image.jpg",
  ogTitle,
  ogDescription,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCreator = "@aryandudharejiya",
  canonicalUrl = "https://aryandudharejiya-portfolio.replit.app",
  structuredData,
  locale = "en_US",
  publishedTime,
  modifiedTime,
}) => {
  const { theme } = useTheme();

  // Generate a default structured data object if none is provided
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aryan Dudharejiya",
    url: canonicalUrl,
    image: ogImage,
    jobTitle: "MERN Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    sameAs: [
      "https://twitter.com/aryandudharejiya",
      "https://github.com/aryandudharejiya",
      "https://linkedin.com/in/aryandudharejiya",
    ],
    description: description,
  };

  // Use the provided structured data or the default one
  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Base Meta Tags */}
      <html lang="en" data-theme={theme} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="Aryan Dudharejiya Portfolio" />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterCreator} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta
        name="twitter:description"
        content={twitterDescription || ogDescription || description}
      />
      <meta name="twitter:image" content={twitterImage || ogImage} />
      <meta name="twitter:creator" content={twitterCreator} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Mobile Optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta
        name="apple-mobile-web-app-title"
        content="Aryan Dudharejiya Portfolio"
      />

      {/* PWA related */}
      <meta name="application-name" content="Aryan Dudharejiya Portfolio" />
      <meta
        name="theme-color"
        content={theme === "dark" ? "#1e1e2e" : "#ffffff"}
      />
      <link rel="manifest" href="/manifest.json" />

      {/* Icons */}
      <link rel="icon" type="image/svg+xml" href="/icons/logo.svg" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-touch-icon.svg"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        sizes="192x192"
        href="/icons/icon-192x192.svg"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        sizes="512x512"
        href="/icons/icon-512x512.svg"
      />

      {/* Performance Headers */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* Site verification tags (replace with real values when available) */}
      <meta
        name="google-site-verification"
        content="your-google-verification-code"
      />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      <meta
        name="yandex-verification"
        content="your-yandex-verification-code"
      />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
