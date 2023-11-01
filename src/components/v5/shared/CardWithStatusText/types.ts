import { PropsWithChildren } from 'react';
import { CardWithSectionsProps } from '../CardWithSections/types';
import { StatusTextProps } from '../StatusText/types';

export interface CardWithStatusTextProps extends CardWithSectionsProps {
  statusTextSectionProps: PropsWithChildren<StatusTextProps> & {
    content?: React.ReactNode;
  };
}
