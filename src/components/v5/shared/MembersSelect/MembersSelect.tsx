import React, { FC, useState } from 'react';
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

  // @TODO: If used in card select user as default
  const handleChange = (selectedOption: number | undefined) => {
    setSelectedMember(selectedOption);
  };

  return (
    <Select
      handleChange={handleChange}
      selectedElement={selectedMember}
      isLoading={loading}
      list={members}
      placeholderText={user ? undefined : { id: 'members.modal.selectMember' }}
      showAvatar
    />
  );
};

MembersSelect.displayName = displayName;

export default MembersSelect;
