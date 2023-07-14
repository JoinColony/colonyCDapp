import { useState } from 'react';

import { WhitelistedUser } from '~common/Dialogs/ManageWhitelistDialog/WhitelistedAddresses/helpers';

export const useVerifiedTable = () => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: WhitelistedUser,
  ) => {
    const { checked } = e.target;
    const { address } = item;
    if (checked) {
      setSelectedMembers((prevState) => [...prevState, address]);
    } else {
      setSelectedMembers((prevState) =>
        prevState.filter(
          (selectedMemberAddress) => selectedMemberAddress !== address,
        ),
      );
    }
  };

  return {
    selectedMembers,
    onChange,
  };
};
