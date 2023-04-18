import React, { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { ExtensionStatusBadgeProps } from './types';

const displayName = 'common.Extensions.ExtensionStatusBadge';

const ExtensionStatusBadge: React.FC<PropsWithChildren<ExtensionStatusBadgeProps>> = ({
  mode = 'Coming soon',
  children,
  text,
  textValues,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const extensionStatusBadgeText = typeof text == 'string' ? text : text && formatMessage(text, textValues);

  return (
    <span
      className={clsx('inline-flex items-center text-center text-sm font-medium px-3 py-1 rounded-3xl h-[1.625rem]', {
        'text-indigo-400 bg-indigo-100': mode === 'Coming soon',
        'text-blue-400 bg-blue-100': mode === 'Not installed',
        'text-green-400 bg-green-100': mode === 'Enabled' || mode === 'New',
        'text-red-400 bg-red-100': mode === 'Disabled',
        'text-purple-400 bg-purple-100': mode === 'Deprecated',
        'text-gray-900 bg-base-white border border-gray-200': mode === 'Governance',
      })}
      {...rest}
    >
      {extensionStatusBadgeText || children}
    </span>
  );
};

ExtensionStatusBadge.displayName = displayName;

export default ExtensionStatusBadge;
