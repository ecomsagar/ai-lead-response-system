// Basic business details. Change these and they update everywhere on the site.
export const site = {
  name: "Sagar Flow",
  url: "https://sagarflow.com",
  tagline: "Take your business online in 30 days.",
  description:
    "Sagar Flow takes small UAE businesses online in 30 days: website, Shopify, Noon, Amazon, social media and ads. Then we manage it every month. Based in Dubai.",
  founder: "Sagar",
  city: "Dubai",
  country: "AE",
  email: "sagar@sagarflow.com",
  whatsappNumber: "971588673613", // no "+" and no spaces
  whatsappDisplay: "+971 58 867 3613",
  hours: "Sun – Thu, 10:00 – 19:00 (GST)",
  // Portfolio page, "Recent work" on home, nav + footer links. Only finished case studies show
  // (see src/lib/caseStudies.ts); with none, a "coming soon" message shows instead.
  showPortfolio: true,

  sameAs: [
    // Paste your social profile URLs here, e.g. "https://instagram.com/sagarflow"
  ] as string[],

  // Analytics. Leave empty to switch off. Paste the ID to switch on.
  analytics: {
    googleAnalyticsId: "", // e.g. "G-XXXXXXXXXX"
    metaPixelId: "", // e.g. "123456789012345"
    googleAdsId: "", // e.g. "AW-123456789"
  },
};
