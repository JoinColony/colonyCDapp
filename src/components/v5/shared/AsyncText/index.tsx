import React, { useEffect, useState } from 'react';

import { defaultMessages } from './consts';
import { AsyncTextProps } from './types';
import { getInitialText } from './utils';
import { formatText } from '~utils/intl';

const displayName = 'v5.AsyncText';

const AsyncText: React.FC<AsyncTextProps> = ({
  text: textProp,
  loadingMessage = defaultMessages.loading,
  errorMessage = defaultMessages.error,
}) => {
  const [text, setText] = useState(() =>
    getInitialText(textProp, loadingMessage),
  );

  useEffect(() => {
    if (typeof textProp !== 'function') {
      return;
    }

    (async (): Promise<void> => {
      try {
        setText(await textProp());
      } catch {
        setText(
          typeof errorMessage === 'string'
            ? errorMessage
            : formatText(errorMessage),
        );
      }
    })();
  }, [errorMessage, textProp]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{text}</>;
};

AsyncText.displayName = displayName;

export default AsyncText;
