import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import {
  type BreadcrumbItem,
  BreadcrumbsContext,
  type BreadcrumbsContextValue,
} from './BreadcrumbsContext.ts';

// @TODO if we end up doing route matching shennanigans, we can remove rootBreadcrumbItem
const BreadcrumbsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [rootBreadcrumbItem, setRootBreadcrumbItem] =
    useState<BreadcrumbItem | null>(null);
  const [shouldShowBreadcrumbs, setShouldShowBreadcrumbs] = useState(false);

  const resetBreadcrumbs = () => {
    setShouldShowBreadcrumbs(false);
    setRootBreadcrumbItem(null);
  };

  const value: BreadcrumbsContextValue = useMemo(
    () => ({
      rootBreadcrumbItem,
      shouldShowBreadcrumbs,
      setShouldShowBreadcrumbs,
      setRootBreadcrumbItem,
      resetBreadcrumbs,
    }),
    [rootBreadcrumbItem, shouldShowBreadcrumbs],
  );

  return (
    <BreadcrumbsContext.Provider value={value}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export default BreadcrumbsContextProvider;
