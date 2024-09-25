import { type PropsWithChildren } from 'react';

import { type MenuWithSectionsProps } from '../MenuWithSections/index.ts';
import { type StatusTextProps } from '../StatusText/types.ts';

export interface MenuWithStatusTextProps extends MenuWithSectionsProps {
  statusTextSectionProps: PropsWithChildren<StatusTextProps> & {
    content?: React.ReactNode;
  };
  isLoading?: boolean;
}
