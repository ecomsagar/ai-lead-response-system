// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://sagarflow.com",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },
  integrations: [
    sitemap({ filter: (page) => !/\/(thank-you|404)$/.test(page) }),
  ],
});
