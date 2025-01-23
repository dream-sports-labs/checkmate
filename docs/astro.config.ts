import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

const SITE = "https://checkmate.dreamsportslabs.com";

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: "Checkmate",
      favicon: "./public/favicon.svg",
      tableOfContents: {
        maxHeadingLevel: 4,
      },
      pagination: true,
      titleDelimiter: "/",
      description: "Remix Application for managing your test cases and runs",
      logo: {
        dark: "./src/assets/checkmate-dark.svg",
        light: "./src/assets/checkmate-light.svg",
        alt: "Checkmate",
      },
      social: {
        github: "https://github.com/dream-sports-labs/checkmate",
      },
      sidebar: [
        {
          label: "Introduction",
          items: [
            "project/introduction",
            "project/application-structure",
            "project/setup",
            {
              label: "TechStack Used",
              slug: "project/techstack",
              badge: {
                text: "WIP",
                variant: "caution",
              },
            },
            {
              label: "RBAC",
              slug: "project/rbac",
            },
          ],
        },
        {
          label: "Guides",
          items: [
            "guides/projects",
            {
              label: "Tests",
              items: ["guides/tests/tests", "guides/tests/bulk-addition"],
            },
            {
              label: "Runs",
              items: ["guides/runs/runs", "guides/runs/run-detail"],
            },
          ],
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
