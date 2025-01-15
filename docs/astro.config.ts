import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

const SITE = "https://genshi.samrith.dev";

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: "Checkmate",
      pagination: true,
      titleDelimiter: "/",
      description: "Remix Application for managing your test cases and runs",
      logo: {
        dark: "./src/assets/logo-dark.png",
        light: "./src/assets/logo-light.png",
        alt: "Checkmate",
      },
      social: {
        github: "https://github.com/dream-sports-labs/checkmate",
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
