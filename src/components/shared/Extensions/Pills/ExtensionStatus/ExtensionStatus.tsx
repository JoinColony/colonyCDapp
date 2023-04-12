import React, { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { ExtensionStatusProps } from './types';

const displayName = 'Pills.ExtensionStatus';

const ExtensionStatus: React.FC<PropsWithChildren<ExtensionStatusProps>> = ({
  mode = 'comingSoon',
  children,
  text,
  textValues,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const extensionStatusText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);

  return (
    <span
      className={clsx(
        'inline-flex items-center text-center text-sm font-medium px-3 py-1 rounded-3xl h-[1.625rem]',
        {
          'text-indigo-400 bg-indigo-100': mode === 'comingSoon',
          'text-blue-400 bg-blue-100': mode === 'notInstalled',
          'text-green-400 bg-green-100': mode === 'enabled' || mode === 'new',
          'text-red-400 bg-red-100': mode === 'disabled',
          'text-purple-400 bg-purple-100': mode === 'deprecated',
          'text-gray-900 bg-base-white border border-gray-200':
            mode === 'governance',
        },
      )}
      {...rest}
    >
      {extensionStatusText || children}
    </span>
  );
};

ExtensionStatus.displayName = displayName;

export default ExtensionStatus;
