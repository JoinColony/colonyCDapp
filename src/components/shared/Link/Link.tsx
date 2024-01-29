import React from 'react';
import { type MessageDescriptor, useIntl } from 'react-intl';
import {
  Link as LinkComponent,
  type LinkProps as LinkComponentProps,
} from 'react-router-dom';

import { type SimpleMessageValues } from '~types/index.ts';

interface Props extends LinkComponentProps {
  /** A string or a `messageDescriptor` that make up the link's text */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;
}

const Link = ({ children, text, textValues, ...linkProps }: Props) => {
  const { formatMessage } = useIntl();

  const linkText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);

  return <LinkComponent {...linkProps}>{linkText || children}</LinkComponent>;
};

export default Link;
