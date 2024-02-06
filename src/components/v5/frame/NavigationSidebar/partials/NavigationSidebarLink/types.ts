import { type Icon } from '@phosphor-icons/react';
import { type NavLinkProps } from 'react-router-dom';

import { type PillsProps } from '~v5/common/Pills/types.ts';

export interface NavigationSidebarLinkProps extends NavLinkProps {
  icon: Icon;
  tagProps?: PillsProps;
  disabled?: boolean;
}
