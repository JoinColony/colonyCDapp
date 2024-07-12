export const isChildOf = (parent: Element | null, child: Element): boolean =>
  !!parent && parent.contains(child);
