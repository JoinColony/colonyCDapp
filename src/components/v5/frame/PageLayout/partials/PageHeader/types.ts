import { type PageHeadingProps } from '../PageHeading/types.ts';

export interface PageHeaderProps {
  userNavigation: React.ReactNode;
  pageHeadingProps?: PageHeadingProps;
  className?: string;
}
