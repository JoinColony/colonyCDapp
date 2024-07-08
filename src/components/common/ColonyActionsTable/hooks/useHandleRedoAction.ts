import { useEffect } from 'react';

import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';

import { type ColonyActionsTableProps } from '../types.ts';

export const useHandleRedoAction = ({
  actionProps,
}: {
  actionProps: ColonyActionsTableProps['actionProps'];
}) => {
  const { showActionSidebar } = useActionSidebarContext();

  useEffect(() => {
    if (actionProps.defaultValues && actionProps.selectedAction) {
      showActionSidebar(ActionSidebarMode.CreateAction, {
        initialValues: actionProps.defaultValues,
      });

      setTimeout(() => {
        actionProps.setSelectedAction(undefined);
      }, 50);
    }
  }, [
    actionProps.defaultValues,
    showActionSidebar,
    actionProps.selectedAction,
    actionProps,
  ]);
};
