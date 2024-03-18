import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { type PageHeadingProps } from '~v5/frame/PageLayout/partials/PageHeading/types.ts';

import { PageHeadingContext } from './PageHeadingContext.ts';

const PageHeadingContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [breadcrumbs, setBreadcrumbs] = useState<
    PageHeadingProps['breadcrumbs'] | undefined
  >(undefined);

  const value = useMemo(
    () => ({
      title,
      setTitle,
      breadcrumbs,
      setBreadcrumbs,
    }),
    [breadcrumbs, title],
  );

  return (
    <PageHeadingContext.Provider value={value}>
      {children}
    </PageHeadingContext.Provider>
  );
};

export default PageHeadingContextProvider;
