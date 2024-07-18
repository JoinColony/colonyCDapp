import { ArrowSquareOut, Repeat } from '@phosphor-icons/react';
import React, { useMemo } from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import TransactionLink from '~shared/TransactionLink/TransactionLink.tsx';
import { formatText } from '~utils/intl.ts';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';

export const useGetItems = ({
  transactionHash,
  defaultValues,
  showRedoItem,
}) => {
  const {
    actionSidebarToggle: [
      ,
      { toggleOn: toggleActionSidebarOn, toggleOff: toggleActionSidebarOff },
    ],
  } = useActionSidebarContext();

  return useMemo(() => {
    const menuItems: MeatBallMenuItem[] = [];

    if (showRedoItem) {
      menuItems.push({
        key: '1',
        label: formatText({ id: 'completedAction.redoAction' }),
        icon: Repeat,
        onClick: () => {
          toggleActionSidebarOff();

          setTimeout(() => {
            toggleActionSidebarOn({ ...defaultValues });
          }, 500);
        },
      });
    }

    menuItems.push({
      key: '2',
      label: (
        <TransactionLink hash={transactionHash}>
          {formatText(
            { id: 'completedAction.view' },
            {
              blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
            },
          )}
        </TransactionLink>
      ),
      icon: ArrowSquareOut,
    });

    return menuItems;
  }, [
    transactionHash,
    defaultValues,
    showRedoItem,
    toggleActionSidebarOn,
    toggleActionSidebarOff,
  ]);
};
