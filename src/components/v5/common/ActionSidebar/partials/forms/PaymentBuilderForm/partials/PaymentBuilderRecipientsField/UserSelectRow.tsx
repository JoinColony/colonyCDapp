import { isAddress } from 'ethers/lib/utils';
import React from 'react';
import { useController } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';

export const UserSelectRow = ({ row, name }: any) => {
  const userSelectName = `${name}.${row.index}.recipient`;

  const { field } = useController({
    name: userSelectName,
  });

  const isUserAddressValid = isAddress(field.value);
  return (
    <div key={row.id}>
      <UserSelect
        name={userSelectName}
        tooltipContent={
          !isUserAddressValid &&
          formatText({ id: 'actionSidebar.addressErrorTooltip' })
        }
      />
    </div>
  );
};
