// @ts-check
import starlight from "@astrojs/starlight";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import { defineConfig } from "astro/config";

const SITE = "https://genshi.samrith.dev";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: "Genshi",
      pagination: true,
      titleDelimiter: "/",
      description:
        "Simple, composable, and effective state management for JavaScript.",
      logo: {
        dark: "./src/assets/logo-dark.svg",
        light: "./src/assets/logo-light.svg",
        alt: "Genshi Logo",
        replacesTitle: true,
      },
      social: {
        github: "https://github.com/samrith-s/genshi",
      },
      sidebar: [
        {
          label: "Project",
          autogenerate: { directory: "project" },
        },
        {
          label: "Guides",
          autogenerate: {
            directory: "guides",
          },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/tailwind.css", "@fontsource-variable/inter"],
      components: {
        Head: "./src/overrides/head.astro",
      },
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
