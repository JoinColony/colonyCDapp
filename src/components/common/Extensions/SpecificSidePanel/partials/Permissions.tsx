import React, { FC } from 'react';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge';
import { PermissionsProps } from '../types';

const displayName = 'common.Extensions.partials.Permissions';

const Permissions: FC<PermissionsProps> = ({ data }) => (
  <div className="flex flex-wrap">
    {/* {neededColonyPermissions.map((permision, value) => () => (
      <span key={permision} className="pr-1 pb-1">
        <UserPermissionsBadge name={permision}>
          {permision}
        </UserPermissionsBadge>
    </span>
    ))} */}
    {data?.map(({ text, key, name, description }) => (
      <span key={key} className="pr-1 pb-1">
        <UserPermissionsBadge name={name} text={text} description={description}>
          {text}
        </UserPermissionsBadge>
      </span>
    ))}
  </div>
);

Permissions.displayName = displayName;

export default Permissions;
