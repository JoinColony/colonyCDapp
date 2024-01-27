import React, {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { PageHeadingProps } from '~v5/frame/PageLayout/partials/PageHeading/types.ts';

import { PageHeadingContextValue } from './types.ts';

export const PageHeadingContext = createContext<PageHeadingContextValue>({
  title: undefined,
  setTitle: () => {},
  breadcrumbs: undefined,
  setBreadcrumbs: () => {},
});

export const PageHeadingContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
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
