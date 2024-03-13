import React, { type FC, type PropsWithChildren } from 'react';

import { type RoleOptionLabelProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.RoleOptionLabel';

const RoleOptionLabel: FC<PropsWithChildren<RoleOptionLabelProps>> = ({
  children,
  description,
  icon: Icon,
}) => {
  return (
    <div className="flex rounded-lg md:hover:bg-gray-50">
      <span className="flex-shrink-0 pr-3 pt-1 text-gray-900">
        <Icon size={14} />
      </span>
      <div className="flex flex-col text-left">
        <span className="role-title text-gray-900">{children}</span>
        {description && (
          <span className="text-sm text-gray-600">{description}</span>
        )}
      </div>
    </div>
  );
};

RoleOptionLabel.displayName = displayName;

export default RoleOptionLabel;
