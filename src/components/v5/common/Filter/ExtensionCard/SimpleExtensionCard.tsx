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
    <div className="w-full h-full flex flex-col p-5 rounded-lg border border-gray-200 bg-gray-25">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 justify-between truncate">
          <span className="inline-block w-full text-1 truncate">
            {extensionName}
          </span>
          <ExtensionStatusBadge
            mode="extension"
            text={formatText({ id: 'permissionsPage.extension' })}
          />
        </div>
        <div className="flex-shrink-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
    </div>
  );
};

SimpleExtensionCard.displayName = displayName;

export default SimpleExtensionCard;
