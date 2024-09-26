import { type MenuWithSectionsProps } from '../MenuWithSections/index.ts';

export interface MenuWithStatusTextProps extends MenuWithSectionsProps {
  content?: React.ReactNode;
  statusText?: React.ReactNode;
}
