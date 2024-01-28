import { useContext, useEffect } from 'react';

import { type PageHeadingProps } from '~v5/frame/PageLayout/partials/PageHeading/types.ts';

import { PageHeadingContext } from './PageHeadingContext.tsx';
import { type PageHeadingContextValue } from './types.ts';

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
