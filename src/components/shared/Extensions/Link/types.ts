import { MessageDescriptor } from 'react-intl';
import { LinkProps as LinkComponentProps } from 'react-router-dom';
import { SimpleMessageValues } from '~types';

export interface LinkProps extends LinkComponentProps {
  to: string;
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
