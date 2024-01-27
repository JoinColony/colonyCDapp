import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import Icon from '~shared/Icon/index.ts';

import { ICON_NAME } from './consts.ts';
import { TokenStatusProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.TokenSelect.partials.TokenStatus';

const TokenStatus: FC<PropsWithChildren<TokenStatusProps>> = ({
  status,
  children,
}) => (
  <div
    className={clsx('flex items-center gap-2 text-md', {
      'text-success-400': status === 'success',
      'text-negative-400': status === 'error',
    })}
  >
    <Icon name={ICON_NAME[status]} appearance={{ size: 'extraTiny' }} />
    {children}
  </div>
);

TokenStatus.displayName = displayName;

export default TokenStatus;
