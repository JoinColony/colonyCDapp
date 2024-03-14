import { createContext, useContext, useEffect } from 'react';

import { type PageHeadingProps } from '~v5/frame/PageLayout/partials/PageHeading/types.ts';

interface PageHeadingContextValue {
  title?: string;
  setTitle: (title: string | undefined) => void;
  breadcrumbs?: PageHeadingProps['breadcrumbs'];
  setBreadcrumbs: (breadcrumbs: PageHeadingProps['breadcrumbs']) => void;
}

export const PageHeadingContext = createContext<PageHeadingContextValue>({
  title: undefined,
  setTitle: () => {},
  breadcrumbs: undefined,
  setBreadcrumbs: () => {},
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

export const useSetPageBreadcrumbs = (
  breadcrumbs: PageHeadingProps['breadcrumbs'],
) => {
  const { setBreadcrumbs } = usePageHeadingContext();

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);

    return () => {
      setBreadcrumbs([]);
    };
  }, [breadcrumbs, setBreadcrumbs]);
};
