import { useState } from 'react';
import { ColonyContributor } from '~types';

export const useVerifiedTable = () => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: ColonyContributor,
  ) => {
    const { checked } = e.target;
    const { contributorAddress: address } = item;
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
