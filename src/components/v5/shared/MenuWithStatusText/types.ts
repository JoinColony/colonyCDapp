import { PropsWithChildren } from 'react';
import { MenuWithSectionsProps } from '../MenuWithSections';
import { StatusTextProps } from '../StatusText/types';

export interface MenuWithStatusTextProps extends MenuWithSectionsProps {
  statusTextSectionProps: PropsWithChildren<StatusTextProps> & {
    content?: React.ReactNode;
  };
}
