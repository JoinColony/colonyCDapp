import { ReactNode } from 'react';

import { OmniPickerData, ItemDataType } from '~shared/OmniPicker';
import { User, Safe } from '~types';

/*
Extracts the required values to be used in the SingleUserPicker
on selection
*/

export type OmniPickerUser = User & OmniPickerData;

export type AvatarRenderFn = (item?: ItemDataType<User | Safe>) => ReactNode;

export const filterUserSelection = (
  data: OmniPickerUser[],
  filterValue: string | undefined,
) => {
  if (!filterValue) {
    return data;
  }

  const filteredUsers = data.filter(
    (user) =>
      user?.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      user?.walletAddress.toLowerCase().includes(filterValue.toLowerCase()) ||
      user?.profile?.displayName
        ?.toLowerCase()
        .includes(filterValue.toLowerCase()),
  );

  const customUser: Omit<OmniPickerUser, 'name'> = {
    id: 'filterValue',
    profile: {
      displayName: filterValue,
    },
    walletAddress: filterValue,
  };

  return [customUser].concat(filteredUsers);
};
