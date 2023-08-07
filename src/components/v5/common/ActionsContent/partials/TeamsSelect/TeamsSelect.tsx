import React, { FC } from 'react';

import { useTeamsSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import { SelectProps } from '../../types';

const displayName = 'v5.common.ActionsContent.partials.TeamsSelect';

const TeamsSelect: FC<SelectProps> = ({ isOpen, onToggle, onSelect }) => {
  const teamsOptions = useTeamsSelect();

  return isOpen ? (
    <SearchSelect
      items={[teamsOptions]}
      isOpen={isOpen}
      onToggle={onToggle}
      onSelect={onSelect}
    />
  ) : null;
};

TeamsSelect.displayName = displayName;

export default TeamsSelect;
