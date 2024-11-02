import { useEffect } from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';

import { type ColonyActionsTableProps } from '../types.ts';

export const useHandleRedoAction = ({
  actionProps,
}: {
  actionProps: ColonyActionsTableProps['actionProps'];
}) => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  useEffect(() => {
    if (actionProps.defaultValues && actionProps.selectedAction) {
      toggleActionSidebarOn({ ...actionProps.defaultValues });

      setTimeout(() => {
        actionProps.setSelectedAction(undefined);
      }, 50);
    }
  }, [
    actionProps.defaultValues,
    toggleActionSidebarOn,
    actionProps.selectedAction,
    actionProps,
  ]);
};
