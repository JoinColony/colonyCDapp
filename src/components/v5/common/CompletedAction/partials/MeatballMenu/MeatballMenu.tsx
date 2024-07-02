import { ArrowSquareOut, Repeat } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks';
import TransactionLink from '~shared/TransactionLink/index.ts';
import { formatText } from '~utils/intl.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';

import { type MeatballMenuProps } from './types.ts';

const MeatballMenu: FC<MeatballMenuProps> = ({
  transactionHash,
  defaultValues,
}) => {
  const isMobile = useMobile();
  const {
    actionSidebarToggle: [
      ,
      { toggleOn: toggleActionSidebarOn, toggleOff: toggleActionSidebarOff },
    ],
  } = useActionSidebarContext();

  return (
    <MeatBallMenu
      contentWrapperClassName={clsx('sm:min-w-[12.75rem]', {
        '!left-6 right-6': isMobile,
      })}
      dropdownPlacementProps={{
        withAutoTopPlacement: true,
        top: 12,
      }}
      items={[
        {
          key: '1',
          label: formatText({ id: 'completedAction.redoAction' }),
          icon: Repeat,
          onClick: () => {
            toggleActionSidebarOff();

            setTimeout(() => {
              toggleActionSidebarOn({ ...defaultValues });
            }, 500);
          },
        },
        {
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
        },
      ]}
    />
  );
};

export default MeatballMenu;
