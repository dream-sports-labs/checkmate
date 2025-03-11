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
        maxHeadingLevel: 5,
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
        discord: "https://discord.gg/W67bA8j8",
      },
      sidebar: [
        {
          label: "Introduction",
          items: [
            "project/introduction",
            "project/application-structure",
            "project/setup",
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
            "guides/user-settings",
            "guides/api",
            {
              label: "RBAC",
              slug: "project/rbac",
            },
          ],
        },
        {
          label: "Developer Docs",
          items: [
            {
              label: "TechStack Used",
              slug: "tech/techstack",
              badge: {
                text: "WIP",
                variant: "caution",
              },
            },
            "tech/db-schema",
            {
              label: "HLD",
              slug: "tech/hld",
              badge: {
                text: "WIP",
                variant: "caution",
              },
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
