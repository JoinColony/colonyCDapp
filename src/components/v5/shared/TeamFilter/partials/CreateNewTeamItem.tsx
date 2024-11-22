import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

const displayName = 'v5.shared.TeamFilter.partials.CreateNewTeamItem';

const CreateNewTeamItem = () => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const handleClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
    });
  };

  return (
    <button
      type="button"
      className="border-d box-border inline-flex h-full items-center rounded-r-lg border-y border-r border-gray-200 bg-base-white px-4 py-2 text-sm font-medium text-gray-400 outline-offset-[-2px] hover:bg-gray-50 hover:text-gray-900"
      onClick={handleClick}
    >
      <Plus size={18} />
    </button>
  );
};

CreateNewTeamItem.displayName = displayName;
export default CreateNewTeamItem;
