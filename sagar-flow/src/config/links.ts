// ALL buttons on the site get their links from this file.
// To switch a package from WhatsApp to Stripe, paste the Stripe Payment Link
// into its `stripe` field. Leave `stripe` empty to keep using WhatsApp.
import { site } from "./site";

export const wa = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const links = {
  whatsapp: wa("Hi Sagar, I want to take my business online."),

  // Paste your Calendly event link, e.g. "https://calendly.com/sagarflow/30min".
  // While empty, "Book a call" buttons open WhatsApp instead.
  calendly: "",

  plans: {
    starter: {
      stripe: "", // e.g. "https://buy.stripe.com/xxxx"
      whatsapp: wa("Hi Sagar, I want to subscribe to the Starter package (AED 1,499)."),
    },
    store: {
      stripe: "",
      whatsapp: wa("Hi Sagar, I want to subscribe to the Store package (AED 2,999)."),
    },
    full: {
      stripe: "",
      whatsapp: wa("Hi Sagar, I want to subscribe to the Full package (AED 3,999)."),
    },
    growth: {
      stripe: "",
      whatsapp: wa("Hi Sagar, I want to become a Growth Partner (AED 1,199/month)."),
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
