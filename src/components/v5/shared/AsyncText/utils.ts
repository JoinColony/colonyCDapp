import { MessageDescriptor } from 'react-intl';

import React from 'react';
import { AsyncTextProps } from './types';
import { formatText } from '~utils/intl';

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
