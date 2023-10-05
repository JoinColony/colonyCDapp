const getLastIndexFromPath = (path: string | undefined): number | undefined => {
  if (!path) {
    return undefined;
  }

  const matchIndex = /\[(?<index>\d*)(?![\s\S]*\[\d*\])/;
  const index = matchIndex.exec(path)?.groups?.index;

  return index ? Number(index) : undefined;
};

export default getLastIndexFromPath;
