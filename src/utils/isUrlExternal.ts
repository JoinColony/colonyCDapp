import { Path } from 'react-router-dom';

export const isUrlExternal = (url: string | Partial<Path>) => {
  const regEx = /^https/;

  return regEx.test(url as string);
};
