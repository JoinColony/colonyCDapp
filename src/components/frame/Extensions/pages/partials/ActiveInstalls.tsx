import React, { FC } from 'react';

import { EXTENSIONS_COUNT_THRESHOLD } from '~constants';
import { formatText } from '~utils/intl';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';

import { ActiveInstallsProps } from './types';

const displayName = 'frame.Extensions.pages.partials.ActiveInstalls';

const ActiveInstalls: FC<ActiveInstallsProps> = ({ activeInstalls }) => {
  return (
    <div className="sm:hidden md:block">
      {activeInstalls < EXTENSIONS_COUNT_THRESHOLD ? (
        <ExtensionStatusBadge
          mode="new"
          text={formatText({ id: 'status.new' })}
        />
      ) : (
        <p className="text-gray-400 text-sm text-right">
          {activeInstalls.toLocaleString('en-US')}{' '}
          {formatText({ id: 'active.installs' })}
        </p>
      )}
    </div>
  );
};

ActiveInstalls.displayName = displayName;

export default ActiveInstalls;
