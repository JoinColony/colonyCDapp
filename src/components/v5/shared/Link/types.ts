import { MessageDescriptor } from 'react-intl';
import { LinkProps as LinkComponentProps } from 'react-router-dom';

import { SimpleMessageValues } from '~types/index.ts';

export interface LinkProps extends LinkComponentProps {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
