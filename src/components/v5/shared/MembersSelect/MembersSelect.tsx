import React, { FC, useEffect, useState } from 'react';
import { useColonyContext } from '~hooks';

import Select from '~v5/common/Fields/Select';
import { useGetColonyMembers } from './hooks';
import { MemberSelectProps } from './types';

const displayName = 'v5.MembersSelect';

const MembersSelect: FC<MemberSelectProps> = ({ user }) => {
  const { colony } = useColonyContext();
  const { members, loading } = useGetColonyMembers(colony?.colonyAddress);
  const [selectedMember, setSelectedMember] = useState<number | undefined>(
    undefined,
  );

  const handleChange = (selectedOption: number | undefined) => {
    setSelectedMember(selectedOption);
  };

  useEffect(() => {
    if (members && user) {
      const index = members.findIndex(({ walletAddress }) => {
        return walletAddress === user.walletAddress;
      });
      setSelectedMember(index);
    }
  }, [members, user]);

  return (
    <Select
      handleChange={handleChange}
      selectedElement={selectedMember}
      isLoading={loading}
      list={members}
      placeholderText={user ? undefined : { id: 'members.modal.selectMember' }}
      showAvatar
      openButtonClass="selectButton"
    />
  );
};

MembersSelect.displayName = displayName;

export default MembersSelect;
