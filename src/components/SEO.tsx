import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
}

export const SEO = ({ 
  title = "Phototheology Bible Learning Suite",
  description = "The complete Bible learning suite. Master Scripture through the 8-floor Palace method — store God's Word as images, patterns, and structures with Christ-centered interpretation.",
  canonical,
  noindex = false,
  image = "https://thephototheologyapp.com/phototheology-hero.png"
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = "https://thephototheologyapp.com";
  const canonicalUrl = canonical || `${baseUrl}${location.pathname}`;
  const fullTitle = title === "Phototheology Bible Learning Suite" ? title : `${title} | Phototheology`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Phototheology Bible Learning Suite" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
