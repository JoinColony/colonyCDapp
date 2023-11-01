import { OmniPickerData } from '~shared/OmniPicker';
import { User } from '~types';

/*
Extracts the required values to be used in the SingleUserPicker
on selection
*/

export type OmniPickerUser = User & OmniPickerData;

export const filterUserSelection = (
  data: OmniPickerUser[],
  filterValue: string | undefined,
  excludeFilterValue?: boolean,
) => {
  if (!filterValue) {
    return data;
  }

  const filteredUsers = data.filter(
    (user) =>
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

  if (excludeFilterValue) {
    return filteredUsers;
  }

  return [customUser].concat(filteredUsers);
};
