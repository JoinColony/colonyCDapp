import { BreadcrumbsItem } from '~v5/shared/Breadcrumbs/types';

export interface PageHeadingProps {
  title?: string;
  breadcrumbs: BreadcrumbsItem[];
  className?: string;
}
