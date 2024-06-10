import { Extension } from '@colony/colony-js';
import React from 'react';

import { formatText } from '~utils/intl.ts';

interface BulletpointWarningsProps {
  extensionId: Extension;
}

export const BulletpointWarnings: React.FC<BulletpointWarningsProps> = ({
  extensionId,
}) => {
  return (
    <>
      {extensionId !== Extension.StakedExpenditure && (
        <li>
          {formatText({
            id: 'extensionPage.uninstallBoxOne',
          })}
        </li>
      )}
      <li>
        {formatText({
          id: 'extensionPage.uninstallBoxTwo',
        })}
      </li>
    </>
  );
};
