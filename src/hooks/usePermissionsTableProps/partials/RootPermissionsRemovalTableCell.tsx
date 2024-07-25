import React from 'react';

import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

export const RootPermissionsRemovalTableCell = ({
  permissions,
}: {
  permissions: React.ReactNode[];
}) => (
  <div className="space-y-2">
    {permissions.map((permission) => (
      <ul key={JSON.stringify(permission)} className="list-disc pl-6">
        <li className="text-gray-600" key={JSON.stringify(permission)}>
          <div className="flex items-center justify-between">
            {permission}
            <PillsBase
              isCapitalized={false}
              className="bg-negative-100 text-negative-400"
            >
              {formatText({
                id: 'badge.removed',
              })}
            </PillsBase>
          </div>
        </li>
      </ul>
    ))}
  </div>
);
