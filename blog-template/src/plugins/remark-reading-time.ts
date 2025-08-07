import type { Root } from "mdast";
import type { VFile } from "vfile";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
export function remarkReadingTime() {
  return (tree: Root, file: VFile) => {
    const textContent = toString(tree);
    const readingTime = getReadingTime(textContent);
    file.data.astro!.frontmatter!.readingTime = Math.ceil(readingTime.minutes);
  };
}
