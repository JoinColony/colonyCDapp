import React, { FC } from 'react';
import { PermissionsProps } from '../types';

const displayName = 'common.Extensions.partials.Permissions';

const Permissions: FC<PermissionsProps> = ({ data }) => (
  <div className="flex flex-wrap">
    {data?.map(({ title, id }) => (
      <span key={id} className="pr-1">
        {title}
      </span>
    ))}
  </div>
);

Permissions.displayName = displayName;

export default Permissions;
