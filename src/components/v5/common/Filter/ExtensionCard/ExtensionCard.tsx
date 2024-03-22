import React, { type FC } from 'react';

import { type UserRoleMeta } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';
import RolesTooltip from '~v5/shared/RolesTooltip/RolesTooltip.tsx';

const displayName = 'v5.common.ExtensionCard';

interface ExtensionCardProps {
  extensionName: string;
  meatBallMenuProps: MeatBallMenuProps;
  role?: UserRoleMeta;
}

const ExtensionCard: FC<ExtensionCardProps> = ({
  extensionName,
  meatBallMenuProps,
  role,
}) => {
  return (
    <div className="w-full h-full flex flex-col p-5 rounded-lg border border-gray-200 bg-gray-25">
      <div className="w-full flex items-center relative flex-grow justify-center flex-col">
        <div className="flex items-center gap-2 justify-between truncate">
          <span className="inline-block w-full text-1 truncate">
            {extensionName}
          </span>
          <ExtensionStatusBadge
            mode="extension"
            text={formatText({ id: 'permissionsPage.extension' })}
          />
        </div>
        <div className="absolute top-0 right-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
      {role && (
        <div className="w-full pt-[.6875rem] mt-[.6875rem] border-t border-t-gray-200 flex items-center justify-between gap-4">
          {role && (
            <div className="ml-auto">
              <RolesTooltip role={role} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ExtensionCard.displayName = displayName;

export default ExtensionCard;
