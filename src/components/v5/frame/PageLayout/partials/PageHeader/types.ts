import { PageHeadingProps } from '../PageHeading/types';

export interface PageHeaderProps extends Omit<PageHeadingProps, 'className'> {
  userNavigation: React.ReactNode;
  className?: string;
}
