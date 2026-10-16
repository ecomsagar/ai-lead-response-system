# Sagar Flow website

Marketing site for **sagarflow.com**. Built with [Astro](https://astro.build): fast static pages, no heavy JavaScript.

Mobile Lighthouse (local build): Performance 95 · Accessibility 100 · Best Practices 100 · SEO 100.

## Run it on your computer

```bash
cd sagar-flow
npm install
npm run dev        # open http://localhost:4321
npm run build      # checks for errors, then builds the site into dist/
```

## Where things live

| You want to change… | Edit this file |
|---|---|
| Business name, email, WhatsApp number, analytics IDs | `src/config/site.ts` |
| **Any button link** (WhatsApp, Stripe, Calendly) | `src/config/links.ts` |
| Prices, package contents, founding offer | `src/config/pricing.ts` |
| Home page text (problems, services, steps, stats, FAQ) | `src/data/home.ts` |
| Case studies | `src/content/case-studies/*.md` |
| Colors and fonts | `src/styles/global.css` (top of file) |
| Terms / privacy text | `src/pages/terms.astro`, `src/pages/privacy.astro` |

## Edit text

Open the file from the table, change the words between the quotes, and save. Don't remove the quotes or commas.

## Change prices

Open `src/config/pricing.ts` and change `price: 2999` (numbers only, no commas). The site formats it as `AED 2,999`.
Also update the WhatsApp message in `src/config/links.ts` so the message says the new price.

When the 3 founding spots are taken, set `foundingOffer: { active: false, ... }`.

## Swap WhatsApp buttons to Stripe payment links

1. In Stripe, create a Payment Link for the package. Turn on "Allow promotion codes".
   Set "After payment" → "Redirect to your website" → `https://sagarflow.com/thank-you`.
2. Open `src/config/links.ts` and paste the link into that package's `stripe` field:
   ```ts
   store: {
     stripe: "https://buy.stripe.com/xxxxxxxx",
     whatsapp: wa("..."),
   },
   ```
3. Save and deploy. The button changes to "Buy Store" and a small "Questions first? Chat on WhatsApp" link appears under it.
   Leave `stripe: ""` empty to keep using WhatsApp. The same works for Ziina links.

## Add the Calendly booking calendar

Paste your event link into `calendly` in `src/config/links.ts`, e.g. `"https://calendly.com/sagarflow/30min"`.
The calendar then appears inside the "Book a free call" section. It only loads when a visitor scrolls near it, so the page stays fast.
While empty, every "Book a call" button opens WhatsApp.

## Add a case study

1. Copy any file in `src/content/case-studies/`, e.g. `noon-store-launch.md`, and rename it. The file name becomes the URL:
   `perfume-shop-noon.md` → `sagarflow.com/case-studies/perfume-shop-noon`.
2. Fill in the fields at the top. Rules:
   - `category`: one of `noon`, `amazon`, `ads`, `website`, `automation`.
   - `stats`: exactly 3 items. `steps`: exactly 3 items.
   - `featured: true` puts it on the home page (up to 3 show, lowest `order` first).
   - `order`: lower numbers show first on the portfolio page.
3. Images: put them in `public/case-studies/` and set `heroImage: "/case-studies/your-image.webp"`.
   Same for `before: { image: "..." }` and `after: { image: "..." }`. Until you add an image, a labelled placeholder shows.
4. Video: set `video: "https://youtu.be/..."` (or Loom).
5. Anything you write below the second `---` shows as extra text on the page.
6. Delete the example case studies you don't need.

`npm run build` tells you exactly which field is wrong if something is missing.

## Placeholders to replace before launch

Search the project for `[` to find them all: `[NUMBER]`, `[SCREENSHOT: …]`, `[VIDEO: …]`, `[CLIENT …]`.
Never replace them with made-up numbers. Use real numbers only.
Your photo: save it as `public/sagar.webp` and change the `Placeholder` in `src/pages/index.astro` to `src="/sagar.webp" alt="Sagar, founder of Sagar Flow"`.

## Analytics and ad tracking

In `src/config/site.ts`, paste:
- `googleAnalyticsId`: `G-XXXXXXX`
- `metaPixelId`: your Pixel ID
- `googleAdsId`: `AW-XXXXXXX`

Events sent automatically: `Contact` (WhatsApp click), `Schedule` (booking click / Calendly booking), `InitiateCheckout` (package button), `Purchase` (thank-you page).

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Compute (Workers & Pages) → Create → Pages → Connect to Git** → pick the repo.
3. Settings:
   - Framework preset: **Astro**
   - Root directory: **`sagar-flow`**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22`
4. Deploy. You get a `*.pages.dev` link to check.
5. Project → **Custom domains** → add `sagarflow.com` and `www.sagarflow.com`. Cloudflare sets up DNS and SSL by itself because the domain is already in your account.
6. After that, every push to the branch updates the site in about a minute.

## SEO included

- Title and description on every page, Open Graph image (`public/og-image.png`)
- `sitemap-index.xml` (automatic) and `robots.txt`
- LocalBusiness (ProfessionalService, Dubai) and FAQ schema
- Clean URLs (`/portfolio`, `/case-studies/...`)
