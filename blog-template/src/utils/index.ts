export type HeadingData = {
  depth: number;
  text: string;
  slug: string;
  children?: HeadingData[];
};

export function buildHeadingTree(headings: HeadingData[]) {
  const tree: HeadingData[] = [];
  const stack: HeadingData[] = [];

  for (const heading of headings) {
    const newLevel = heading.depth;

    // 创建带 children 的新节点
    const node = { ...heading, children: [] };

    if (stack.length === 0) {
      // 如果栈为空，说明是顶级节点
      tree.push(node);
      stack.push(node);
    } else {
      const lastNode = stack[stack.length - 1];

      if (newLevel > lastNode.depth) {
        // 当前标题比上一个深一级，加入最近节点的 children
        lastNode.children?.push(node);
        stack.push(node);
      } else if (newLevel === lastNode.depth) {
        // 同级节点，弹出栈顶并加到父级的同级
        stack.pop();
        if (stack.length === 0) {
          tree.push(node);
          stack.push(node);
        } else {
          stack[stack.length - 1].children?.push(node);
          stack.push(node);
        }
      } else {
        // 当前标题比上一个浅，需要回溯栈直到找到合适的父级
        while (stack.length > 0 && stack[stack.length - 1].depth >= newLevel) {
          stack.pop();
        }

        if (stack.length === 0) {
          tree.push(node);
          stack.push(node);
        } else {
          stack[stack.length - 1].children?.push(node);
          stack.push(node);
        }
      }
    }
  }

  return tree;
}
