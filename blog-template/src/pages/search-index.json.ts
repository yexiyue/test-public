import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export type Article = {
  slug: string;
  title: string;
  content: string;
  group: string;
};

const documents: Article[] = [];

const docs = await getCollection("docs");

documents.push(
  ...docs.map((doc) => ({
    slug: `/ratatui-kit-website/docs/${doc.id}`,
    title: doc.data.title,
    content: doc.body ?? "",
    group: "docs",
  }))
);

const examples = await getCollection("example");
documents.push(
  ...examples.map((example) => ({
    slug: `/ratatui-kit-website/example/${example.id}`,
    title: example.data.title,
    content: example.body ?? "",
    group: "example",
  }))
);

const principles = await getCollection("principle");
documents.push(
  ...principles.map((principle) => ({
    slug: `/ratatui-kit-website/principle/${principle.id}`,
    title: principle.data.title,
    content: principle.body ?? "",
    group: "principle",
  }))
);

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(documents), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
