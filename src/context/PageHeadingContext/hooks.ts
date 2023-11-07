import { useContext, useEffect } from 'react';
import { PageHeadingContext } from './PageHeadingContext';
import { PageHeadingContextValue } from './types';

const usePageHeadingContext = (): PageHeadingContextValue =>
  useContext(PageHeadingContext);

export default usePageHeadingContext;

export const useSetPageHeadingTitle = (title: string | undefined) => {
  const { setTitle } = usePageHeadingContext();

  useEffect(() => {
    setTitle(title);

    return () => {
      setTitle(undefined);
    };
  }, [setTitle, title]);
};
