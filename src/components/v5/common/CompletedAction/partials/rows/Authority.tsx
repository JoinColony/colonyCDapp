import { Signature } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import { AUTHORITY_OPTIONS } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.tsx';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';

const displayName = 'v5.common.CompletedAction.partials.Authority';

const Authority = () => {
  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.authority',
          })}
        >
          <div className="flex items-center gap-2">
            <Signature size={ICON_SIZE} />
            <span>{formatText({ id: 'actionSidebar.authority' })}</span>
          </div>
        </Tooltip>
      </div>
      {
        // @TODO: Connect this whehn multi-sig authority is implemented
      }
      <span>{AUTHORITY_OPTIONS[0].label}</span>
    </>
  );
};

Authority.displayName = displayName;
export default Authority;
