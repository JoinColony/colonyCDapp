import { PageHeadingProps } from '~v5/frame/PageLayout/partials/PageHeading/types';

export interface PageHeadingContextValue {
  title?: string;
  setTitle: (title: string | undefined) => void;
  breadcrumbs?: PageHeadingProps['breadcrumbs'];
  setBreadcrumbs: (breadcrumbs: PageHeadingProps['breadcrumbs']) => void;
}
