import { isAddress } from 'ethers/lib/utils';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';

interface UserSelectRowProps {
  name: string;
}

export const UserSelectRow: FC<UserSelectRowProps> = ({ name }) => {
  const { field } = useController({
    name,
  });

  const isUserAddressValid = isAddress(field.value);

  return (
    <UserSelect
      name={name}
      tooltipContent={
        field.value &&
        !isUserAddressValid &&
        formatText({ id: 'actionSidebar.addressErrorTooltip' })
      }
    />
  );
};
