// ALL buttons on the site get their links from this file.
// To switch a package from WhatsApp to Stripe, paste the Stripe Payment Link
// into its `stripe` field. Leave `stripe` empty to keep using WhatsApp.
import { site } from "./site";

export const wa = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

// NOTE: these are Stripe TEST links (contain "test_"). Real cards will not work.
// Replace with LIVE links before taking real payments.
export const links = {
  whatsapp: wa("Hi Sagar, I want to take my business online."),

  // Paste your Calendly event link, e.g. "https://calendly.com/sagarflow/30min".
  // While empty, "Book a call" buttons open WhatsApp instead.
  calendly: "https://calendly.com/sagarflow/30min",

  plans: {
    starter: {
      stripe: "https://buy.stripe.com/test_3cI4gB6PNeT2dhI6sW43S00", // e.g. "https://buy.stripe.com/xxxx"
      whatsapp: wa("Hi Sagar, I'm interested in the Starter package."),
    },
    store: {
      stripe: "https://buy.stripe.com/test_9B64gBb635is3H84kO43S01",
      whatsapp: wa("Hi Sagar, I'm interested in the Store package."),
    },
    full: {
      stripe: "https://buy.stripe.com/test_cNifZj6PNh1agtUbNg43S02",
      whatsapp: wa("Hi Sagar, I'm interested in the Full package."),
    },
    growth: {
      stripe: "https://buy.stripe.com/test_eVqeVf1vt3ak1z02cG43S03",
      whatsapp: wa("Hi Sagar, I'm interested in the Growth Partner plan."),
    },
  },
};

export type PlanId = keyof typeof links.plans;

/** The link a "Buy" / "Subscribe" button should use. */
export const planLink = (id: PlanId) => links.plans[id].stripe || links.plans[id].whatsapp;
export const planUsesStripe = (id: PlanId) => Boolean(links.plans[id].stripe);

/** Booking link: Calendly when set, otherwise WhatsApp. */
export const bookingLink = () =>
  links.calendly || wa("Hi Sagar, I want to book the free 30-minute call.");
