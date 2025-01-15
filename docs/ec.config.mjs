import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default {
  themes: ["vesper"],
  defaultProps: {
    showLineNumbers: true,
  },
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
};
