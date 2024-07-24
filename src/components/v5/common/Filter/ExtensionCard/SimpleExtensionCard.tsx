import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

const displayName = 'v5.common.SimpleExtensionCard';

interface SimpleExtensionCardProps {
  extensionName: string;
  meatBallMenuProps: MeatBallMenuProps;
}

const SimpleExtensionCard: FC<SimpleExtensionCardProps> = ({
  extensionName,
  meatBallMenuProps,
}) => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center justify-between gap-2 truncate">
          <span className="inline-block w-full truncate text-1">
            {extensionName}
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center justify-end gap-2">
          <ExtensionStatusBadge
            mode="extension"
            text={formatText({ id: 'permissionsPage.extension' })}
          />
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
    </div>
  );
};

SimpleExtensionCard.displayName = displayName;

export default SimpleExtensionCard;
