import { type Row } from '@tanstack/react-table';
import { isAddress } from 'ethers/lib/utils';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';

import { type PaymentBuilderRecipientsTableModel } from './types.ts';

interface UserSelectRowProps {
  name: string;
  row: Row<PaymentBuilderRecipientsTableModel>;
}
export const UserSelectRow: FC<UserSelectRowProps> = ({ row, name }) => {
  const { field } = useController({
    name,
  });

  const isUserAddressValid = isAddress(field.value);
  return (
    <div key={row.id}>
      <UserSelect
        name={name}
        tooltipContent={
          !isUserAddressValid &&
          formatText({ id: 'actionSidebar.addressErrorTooltip' })
        }
      />
    </div>
  );
};
