import { useContext, useEffect } from 'react';

import { PageHeadingProps } from '~v5/frame/PageLayout/partials/PageHeading/types';

import { PageHeadingContext } from './PageHeadingContext';
import { PageHeadingContextValue } from './types';

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
