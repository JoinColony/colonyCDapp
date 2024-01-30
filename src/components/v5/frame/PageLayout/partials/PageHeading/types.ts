import { type BreadcrumbsItem } from '~v5/shared/Breadcrumbs/types.ts';

export interface PageHeadingProps {
  title?: string;
  breadcrumbs: BreadcrumbsItem[];
  className?: string;
}
