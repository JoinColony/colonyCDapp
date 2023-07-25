import React, { FC } from 'react';

import CardPermission from './CardPermission';
import { CardPermissionsProps } from '../../types';

const displayName = 'v5.CardWithBios.partials.CardPermissions';

const CardPermissions: FC<CardPermissionsProps> = ({ permissions }) => (
  <div className="flex gap-2">
    {Array.isArray(permissions) ? (
      permissions.map(({ text, type }) => (
        <CardPermission text={text} type={type} />
      ))
    ) : (
      <CardPermission text={permissions.text} type={permissions.type} />
    )}
  </div>
);

CardPermissions.displayName = displayName;

export default CardPermissions;
