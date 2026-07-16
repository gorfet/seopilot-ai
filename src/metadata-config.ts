import { useEffect } from "react";

/**
 * Metadata Configuration Interface for robust SEO parameters
 */
export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  ogType?: "website" | "article" | "profile" | "dashboard";
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterCreator?: string;
  siteName?: string;
}

/**
 * Highly polished default SEO metadata for the SEOPilot AI platform itself
 */
export const DEFAULT_METADATA: MetadataConfig = {
  title: "SEOPilot AI | Premium Full-Stack AI SEO SaaS & Audit Platform",
  description: "Automate technical on-page SEO audits, identify semantic keyword opportunities using Gemini AI, discover competitor gaps, and generate search-engine optimized copy draft briefs.",
  keywords: "SEO audit, AI SEO, keyword planner, competitor analysis, on-page SEO, technical audit, blog optimizer, Gemini AI writer, SERP metadata",
  robots: "index, follow",
  ogType: "website",
  ogImage: "/assets/seopilot_seo_og.png", // Fallback to our premium asset if defined
  twitterCard: "summary_large_image",
  twitterCreator: "@seopilot_ai",
  siteName: "SEOPilot AI SaaS"
};

/**
 * Helper to update or insert a meta tag in the document's head
 */
export function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
  if (typeof document === "undefined") return;

  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  
  if (element) {
    element.setAttribute("content", content);
  } else {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    element.setAttribute("content", content);
    document.head.appendChild(element);
  }
}

/**
 * Helper to update or insert a link tag in the document's head (e.g., canonical)
 */
export function updateLinkTag(relValue: string, href: string) {
  if (typeof document === "undefined") return;

  let element = document.querySelector(`link[rel="${relValue}"]`);

  if (element) {
    element.setAttribute("href", href);
  } else {
    element = document.createElement("link");
    element.setAttribute("rel", relValue);
    element.setAttribute("href", href);
    document.head.appendChild(element);
  }
}

/**
 * Imperative core function to apply SEO metadata update
 */
export function updateMetadata(config: Partial<MetadataConfig>) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const title = config.title || DEFAULT_METADATA.title;
  const description = config.description || DEFAULT_METADATA.description;
  const keywords = config.keywords || DEFAULT_METADATA.keywords || "";
  const robots = config.robots || DEFAULT_METADATA.robots || "index, follow";
  const canonical = config.canonical || window.location.href;
  const ogType = config.ogType || DEFAULT_METADATA.ogType || "website";
  const ogUrl = config.ogUrl || canonical;
  const ogImage = config.ogImage || DEFAULT_METADATA.ogImage || "";
  const twitterCard = config.twitterCard || DEFAULT_METADATA.twitterCard || "summary_large_image";
  const twitterCreator = config.twitterCreator || DEFAULT_METADATA.twitterCreator || "";
  const siteName = config.siteName || DEFAULT_METADATA.siteName || "SEOPilot AI";

  // 1. Title Tag
  document.title = title;

  // 2. Canonical Tag
  updateLinkTag("canonical", canonical);

  // 3. Core Standard Meta Tags
  updateMetaTag("name", "description", description);
  updateMetaTag("name", "keywords", keywords);
  updateMetaTag("name", "robots", robots);

  // 4. OpenGraph Tags for Social Sharing
  updateMetaTag("property", "og:title", title);
  updateMetaTag("property", "og:description", description);
  updateMetaTag("property", "og:url", ogUrl);
  updateMetaTag("property", "og:type", ogType);
  updateMetaTag("property", "og:site_name", siteName);
  if (ogImage) {
    updateMetaTag("property", "og:image", ogImage);
  }

  // 5. Twitter Card Tags
  updateMetaTag("name", "twitter:card", twitterCard);
  updateMetaTag("name", "twitter:title", title);
  updateMetaTag("name", "twitter:description", description);
  if (twitterCreator) {
    updateMetaTag("name", "twitter:creator", twitterCreator);
  }
  if (ogImage) {
    updateMetaTag("name", "twitter:image", ogImage);
  }
}

/**
 * Custom React Hook to sync metadata during view mount and navigation states
 * @param config Custom metadata configuration
 * @param dependencies Optional dependencies to trigger update
 */
export function useMetadata(config: Partial<MetadataConfig>, dependencies: any[] = []) {
  useEffect(() => {
    updateMetadata(config);
    
    // Optional cleanup to restore standard default tags when view unmounts
    return () => {
      if (dependencies.length === 0) {
        updateMetadata(DEFAULT_METADATA);
      }
    };
  }, [
    config.title, 
    config.description, 
    config.keywords, 
    config.canonical, 
    config.ogImage, 
    config.ogType, 
    ...dependencies
  ]);
}

/**
 * Declarative SEOMetadata Component for React views.
 * Can be rendered at the top level of any page component.
 */
export function SEOMetadata(props: Partial<MetadataConfig>) {
  useMetadata(props);
  return null; // Side-effect only component
}
