import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge';
import { PermissionsProps } from '../types';

const displayName = 'common.Extensions.partials.Permissions';

const Permissions: FC<PermissionsProps> = ({ data }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex flex-wrap">
      {data?.map(({ text, key, name, description }) => (
        <span key={key} className="pr-1 pb-1">
          <UserPermissionsBadge name={name} text={text} description={description}>
            {typeof text === 'string' ? text : formatMessage(text)}
          </UserPermissionsBadge>
        </span>
      ))}
    </div>
  );
};

Permissions.displayName = displayName;

export default Permissions;
