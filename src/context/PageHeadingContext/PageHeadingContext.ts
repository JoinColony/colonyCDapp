// @TODO remove this entire thing and render titles on each page instead
import { createContext, useContext, useEffect } from 'react';

interface PageHeadingContextValue {
  title?: string;
  setTitle: (title: string | undefined) => void;
}

export const PageHeadingContext = createContext<PageHeadingContextValue>({
  title: undefined,
  setTitle: () => {},
});

export const usePageHeadingContext = (): PageHeadingContextValue =>
  useContext(PageHeadingContext);

export const useSetPageHeadingTitle = (title: string | undefined) => {
  const { setTitle } = usePageHeadingContext();

  useEffect(() => {
    setTitle(title);

    return () => {
      setTitle(undefined);
    };
  }, [setTitle, title]);
};
