// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import rehypeMermaid from "rehype-mermaid";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), mdx()],
  site: "https://yexiyue.github.io/ratatui-kit-website",
  base: "/ratatui-kit-website",
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          // 可选配置项
          strategy: "pre-mermaid", // 默认策略是 inline-svg，也可以选择 img-png, img-svg, pre-mermaid
        },
      ],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          // @ts-ignore
          content: fromHtmlIsomorphic(
            '<svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="20" height="20" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg>',
            { fragment: true }
          ).children,
          headingProperties: {
            class: "anchor",
          },
          properties: {
            ariaHidden: "true",
            tabIndex: -1,
            class: "link-anchor",
          },
        },
      ],
    ],
    syntaxHighlight: {
      excludeLangs: ["mermaid", "math"],
    },
  },
});
