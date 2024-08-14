import React, { type FC } from 'react';

import { type CardPermissionsProps } from '~v5/shared/CardWithBios/types.ts';

import CardPermission from './CardPermission.tsx';

const displayName = 'v5.CardWithBios.partials.CardPermissions';

const CardPermissions: FC<CardPermissionsProps> = ({ permissions }) => (
  <div className="flex gap-2">
    {Array.isArray(permissions) ? (
      permissions.map(({ text, icon }) => (
        <CardPermission text={text} icon={icon} />
      ))
    ) : (
      <CardPermission text={permissions.text} icon={permissions.icon} />
    )}
  </div>
);

CardPermissions.displayName = displayName;

export default CardPermissions;
