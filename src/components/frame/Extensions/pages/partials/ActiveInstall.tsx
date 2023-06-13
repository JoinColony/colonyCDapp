import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { MAX_INSTALLED_NUMBER } from '~constants';
import { ActiveInstallsProps } from './types';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';

const displayName = 'frame.Extensions.pages.partials.ActiveInstalls';

const ActiveInstalls: FC<ActiveInstallsProps> = ({ activeInstalls }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      {activeInstalls < MAX_INSTALLED_NUMBER ? (
        <ExtensionStatusBadge mode="new" text={{ id: 'status.new' }} />
      ) : (
        <p className="text-gray-400 text-sm">
          {activeInstalls.toLocaleString('en-US')}{' '}
          {formatMessage({ id: 'active.installs' })}
        </p>
      )}
    </>
  );
};

ActiveInstalls.displayName = displayName;

export default ActiveInstalls;
