import { type MessageDescriptor } from 'react-intl';
import { type LinkProps as LinkComponentProps } from 'react-router-dom';

import { type SimpleMessageValues } from '~types/index.ts';

export interface LinkProps extends LinkComponentProps {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
