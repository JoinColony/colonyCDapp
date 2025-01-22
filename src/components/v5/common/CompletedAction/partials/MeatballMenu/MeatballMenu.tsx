import { ArrowSquareOut, Repeat } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo, type FC } from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks';
import TransactionLink from '~shared/TransactionLink/index.ts';
import { formatText } from '~utils/intl.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';

import { type MeatballMenuProps } from './types.ts';

const MeatballMenu: FC<MeatballMenuProps> = ({
  transactionHash,
  action,
  defaultValues = {},
  showRedoItem = true,
}) => {
  const isMobile = useMobile();
  const { showActionSidebar, hideActionSidebar } = useActionSidebarContext();

  const items = useMemo(() => {
    const menuItems: MeatBallMenuItem[] = [];

    if (showRedoItem) {
      menuItems.push({
        key: '1',
        label: formatText({ id: 'completedAction.redoAction' }),
        icon: Repeat,
        onClick: () => {
          hideActionSidebar();

          setTimeout(() => {
            showActionSidebar(ActionSidebarMode.CreateAction, {
              action,
              initialValues: defaultValues,
            });
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
    action,
    transactionHash,
    defaultValues,
    showRedoItem,
    showActionSidebar,
    hideActionSidebar,
  ]);

  return (
    <MeatBallMenu
      contentWrapperClassName={clsx('sm:min-w-[12.75rem]', {
        '!left-6 right-6': isMobile,
      })}
      hasLeftAlignment
      items={items}
    />
  );
};

export default MeatballMenu;
