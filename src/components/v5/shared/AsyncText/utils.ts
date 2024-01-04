import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { formatText } from '~utils/intl';

import { AsyncTextProps } from './types';

export const getInitialText = (
  text: AsyncTextProps['text'],
  loadingMessage: string | MessageDescriptor,
): React.ReactNode => {
  if (typeof text === 'function') {
    if (typeof loadingMessage === 'string') {
      return loadingMessage;
    }

    return formatText(loadingMessage);
  }

  return text;
};
