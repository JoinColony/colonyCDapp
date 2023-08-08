import React, { FC } from 'react';

import { SelectProps } from '../../types';
import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({ isOpen, onSelect, onToggle }) => {
  const usersOptions = useUserSelect();

  return isOpen ? (
    <SearchSelect
      items={[usersOptions]}
      isOpen={isOpen}
      onToggle={onToggle}
      onSelect={onSelect}
      isLoading={usersOptions.loading}
    />
  ) : null;
};

UserSelect.displayName = displayName;

export default UserSelect;
