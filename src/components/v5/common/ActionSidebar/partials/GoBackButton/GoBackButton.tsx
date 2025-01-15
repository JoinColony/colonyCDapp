import { ArrowLeft } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import {
  getActionGroup,
  mapActionTypeToAction,
} from '~v5/common/ActionSidebar/utils.ts';

interface GoBackButtonProps {
  action?: ColonyAction | null;
  onClick?: () => void;
}

export const GoBackButton: FC<GoBackButtonProps> = ({ action, onClick }) => {
  const { actionSidebarToggle, actionSidebarInitialValues } =
    useActionSidebarContext();
  const { toggleOn: toggleActionSidebarOn } = actionSidebarToggle[1];
  const actionType = mapActionTypeToAction(action);
  const actionGroupType = getActionGroup(
    actionSidebarInitialValues?.[ACTION_TYPE_FIELD_NAME] || actionType,
  );

  const openGroupedAction = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: actionGroupType,
    });
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
