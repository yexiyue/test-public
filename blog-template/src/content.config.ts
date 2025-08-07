import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const principle = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/principle",
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});

const example = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/example",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      index: z.number(),
      image: image(),
    }),
});

const docs = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/docs",
  }),
  schema: z.object({
    title: z.string(),
    index: z.number(),
  }),
});

export const collections = { principle, example, docs };
