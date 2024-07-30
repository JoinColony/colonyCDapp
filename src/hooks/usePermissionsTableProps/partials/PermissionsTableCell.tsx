import chunk from 'lodash/chunk';
import React from 'react';

export const PermissionsTableCell = ({
  permissions = [],
}: {
  permissions: React.ReactNode[];
}) => {
  const permissionsColumns = chunk(
    permissions,
    Math.ceil(permissions.length / 2),
  );

  return (
    <div className="flex w-full gap-4">
      {permissionsColumns.map((column) => (
        <ul key={JSON.stringify(column)} className="flex-1 list-disc pl-6">
          {column.map((permission) => (
            <li className="text-gray-600" key={JSON.stringify(permission)}>
              {permission}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};
