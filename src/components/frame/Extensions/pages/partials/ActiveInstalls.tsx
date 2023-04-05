import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { MAX_INSTALLED_NUMBER } from '~constants';
import { ActiveInstallsProps } from './types';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'frame.Extensions.pages.partials.ActiveInstalls';

const ActiveInstalls: FC<ActiveInstallsProps> = ({ activeInstalls }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="sm:hidden md:block">
      {activeInstalls ? (
        <>
          {activeInstalls < MAX_INSTALLED_NUMBER ? (
            <ExtensionStatusBadge mode="new" text={{ id: 'status.new' }} />
          ) : (
            <p className="text-gray-400 text-sm text-right">
              {activeInstalls.toLocaleString('en-US')}{' '}
              {formatMessage({ id: 'active.installs' })}
            </p>
          )}
        </>
      ) : (
        <SpinnerLoader />
      )}
    </div>
  );
};

ActiveInstalls.displayName = displayName;

export default ActiveInstalls;
