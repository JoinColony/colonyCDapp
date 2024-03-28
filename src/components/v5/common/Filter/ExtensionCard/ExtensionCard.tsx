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
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="relative flex w-full flex-grow flex-col items-center justify-center">
        <div className="flex items-center justify-between gap-2 truncate">
          <span className="inline-block w-full truncate text-1">
            {extensionName}
          </span>
          <ExtensionStatusBadge
            mode="extension"
            text={formatText({ id: 'permissionsPage.extension' })}
          />
        </div>
        <div className="absolute right-0 top-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
      {role && (
        <div className="mt-[.6875rem] flex w-full items-center justify-between gap-4 border-t border-t-gray-200 pt-[.6875rem]">
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
