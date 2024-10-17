import { createContext, useContext } from 'react';

export interface BreadcrumbItem {
  label: string;
  link: string;
}
export interface BreadcrumbsContextValue {
  rootBreadcrumbItem: BreadcrumbItem | null;
  shouldShowBreadcrumbs: boolean;
  setShouldShowBreadcrumbs: (shouldShow: boolean) => void;
  setRootBreadcrumbItem: (item: BreadcrumbItem | null) => void;
  resetBreadcrumbs: () => void;
}

export const BreadcrumbsContext = createContext<
  BreadcrumbsContextValue | undefined
>(undefined);

export const useBreadcrumbsContext = () => {
  const context = useContext(BreadcrumbsContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "BreadcrumbsContext" provider',
    );
  }

  return context;
};
