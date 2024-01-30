import blockies from './blockies.ts';

const iconCache = {};

/**
 * Generate a blockie with the given seed (usually lowercase address).
 * Optionally set the resulting size in pixels.
 */
export default function getIcon(seed: string, size?: number) {
  if (iconCache[seed]) {
    return iconCache[seed];
  }
  const canvasElm = blockies({
    size: 5,
    scale: size ? Math.floor(size / 5) : 10,
    seed,
  });

  iconCache[seed] = canvasElm && canvasElm.toDataURL();
  return iconCache[seed];
}
