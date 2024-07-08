import { ArrowLeft } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { type Action } from '~constants/actions.ts';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { type ColonyAction } from '~types/graphql.ts';
import {
  getActionGroup,
  mapActionTypeToAction,
} from '~v5/common/ActionSidebar/utils.ts';

interface GoBackButtonProps {
  action?: ColonyAction | null;
  onClick?: () => void;
}

export const GoBackButton: FC<GoBackButtonProps> = ({ action, onClick }) => {
  const { showActionSidebar } = useActionSidebarContext();
  const actionType = mapActionTypeToAction(action);
  // FIXME: This probably won't work. Repair
  const actionGroupType = getActionGroup(actionType as Action);

  const openGroupedAction = () => {
    // FIXME: This probably won't work. Repair
    // WHICH OVERVIEW SHOULD IT BE??
    showActionSidebar(ActionSidebarMode.ActionOverview);
  };

  if (!actionGroupType) {
    return null;
  }

  return (
    <button
      type="button"
      className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
      onClick={() => {
        if (onClick) {
          onClick();

          setTimeout(openGroupedAction, 500);

          return;
        }

        openGroupedAction();
      }}
    >
      <ArrowLeft size={18} />
    </button>
  );
};
