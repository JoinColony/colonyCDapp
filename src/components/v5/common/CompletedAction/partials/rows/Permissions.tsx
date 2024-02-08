import { ShieldStar } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';

const displayName = 'v5.common.CompletedAction.partials.Permissions';

interface Props {
  roleName: string;
}

const Permissions = ({ roleName }: Props) => {
  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.managePermissions.permissions',
          })}
        >
          <div className="flex items-center gap-2">
            <ShieldStar size={ICON_SIZE} />
            <span>{formatText({ id: 'actionSidebar.permissions' })}</span>
          </div>
        </Tooltip>
      </div>
      <span>{roleName}</span>
    </>
  );
};

Permissions.displayName = displayName;
export default Permissions;
