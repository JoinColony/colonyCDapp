import React, { type FC, type PropsWithChildren } from 'react';

import { type RoleOptionLabelProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.RoleOptionLabel';

const RoleOptionLabel: FC<PropsWithChildren<RoleOptionLabelProps>> = ({
  children,
  description,
  icon: Icon,
}) => {
  return (
    <div className="flex md:hover:bg-gray-50 rounded-lg">
      <span className="pr-3 pt-1 text-gray-900 flex-shrink-0">
        <Icon size={14} />
      </span>
      <div className="flex flex-col text-left">
        <span className="text-gray-900">{children}</span>
        {description && (
          <span className="text-gray-600 text-sm">{description}</span>
        )}
      </div>
    </div>
  );
};

RoleOptionLabel.displayName = displayName;

export default RoleOptionLabel;
