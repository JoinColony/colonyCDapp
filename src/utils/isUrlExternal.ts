import { Path } from 'react-router-dom';

export const isUrlExternal = (url: string | Partial<Path>) => {
  if (typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    return !!parsedUrl.protocol;
  } catch {
    return false;
  }
};
