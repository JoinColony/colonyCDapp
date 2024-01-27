import { NavLinkProps } from 'react-router-dom';

import { PillsProps } from '~v5/common/Pills/types.ts';

export interface NavigationSidebarLinkProps extends NavLinkProps {
  iconName: string;
  tagProps?: PillsProps;
  disabled?: boolean;
}
