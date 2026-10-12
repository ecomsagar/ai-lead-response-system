// Prices and package contents. Edit text here; the design updates by itself.
import type { PlanId } from "./links";

export type SetupPlan = {
  id: PlanId;
  name: string;
  price: number;
  pitch: string;
  features: string[];
  popular?: boolean;
  note?: string;
};

export const currency = "AED";
export const formatPrice = (n: number) => `${currency} ${n.toLocaleString("en-US")}`;

export const setupPlans: SetupPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 1499,
    pitch: "Get found online.",
    features: [
      "Domain + business email",
      "1-page website",
      "Facebook, Instagram, TikTok pages",
      "Google Business Profile",
      "WhatsApp Business + catalog",
      "Basic SEO",
    ],
  },
  {
    id: "store",
    name: "Store",
    price: 2999,
    popular: true,
    pitch: "Start selling on Noon and your own store.",
    features: [
      "Everything in Starter",
      "Shopify store, up to 30 products",
      "Payments + delivery set up",
      "Noon account + 20 listings",
      "Dubizzle + Facebook Shop",
      "Meta & Google ad accounts + tracking",
    ],
  },
  {
    id: "full",
    name: "Full",
    price: 3999,
    pitch: "Every channel, with automation.",
    features: [
      "Everything in Store",
      "Google & TikTok ad accounts",
      "Order alert automation",
      "Weekly auto sales report",
    ],
    note: "Amazon is included when you add Growth Partner.",
  },
];

export const growthPlan = {
  id: "growth" as PlanId,
  name: "Growth Partner",
  price: 1199,
  period: "month",
  pitch: "After launch, we keep your business growing. Like having an ecommerce team, for one monthly fee.",
  minimum: "Minimum 6 months.",
  amazonBonus: {
    title: "Amazon UAE, fully set up and managed.",
    text: "Amazon seller account and 30 listings. Only for Growth Partner clients, because Amazon needs care every week.",
  },
  features: [
    "Amazon account + 30 listings setup",
    "15 new listings every month",
    "Noon / Amazon PPC managed",
    "Meta ads managed",
    "2 sessions with Sagar every week (30 min each)",
    "Account check twice a week",
    "8 social media posts a month",
    "Weekly auto report + monthly report",
    "45-min growth call every month",
    "WhatsApp support, Sun – Thu",
  ],
  // Set active to false when the 3 founding spots are taken.
  foundingOffer: { active: true, text: "Founding offer: the first 3 clients keep this price." },
};

export const pricingFootnote = "Prices exclude VAT, ad budget and platform fees.";
