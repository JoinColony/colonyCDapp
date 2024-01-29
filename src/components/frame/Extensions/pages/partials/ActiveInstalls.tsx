import React, { type FC } from 'react';

import { EXTENSIONS_COUNT_THRESHOLD } from '~constants/index.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import { type ActiveInstallsProps } from './types.ts';

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
