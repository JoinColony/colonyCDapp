import { PropsWithChildren } from 'react';

import { MenuWithSectionsProps } from '../MenuWithSections/index.ts';
import { StatusTextProps } from '../StatusText/types.ts';

export interface MenuWithStatusTextProps extends MenuWithSectionsProps {
  statusTextSectionProps: PropsWithChildren<StatusTextProps> & {
    content?: React.ReactNode;
  };
}
