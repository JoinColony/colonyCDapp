import { Copy } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import { formatText } from '~utils/intl.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';

import { type MultiSigMeatballMenuProps } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.MultiSigMeatballMenu';

const MultiSigMeatballMenu: FC<MultiSigMeatballMenuProps> = ({
  transactionHash,
}) => {
  const { colony } = useColonyContext();

  const multiSigMeatballOptions: MeatBallMenuItem[] = [
    {
      key: '1',
      label: formatText({ id: 'multiSig.shareAction' }),
      renderItemWrapper: (itemWrapperProps, children) => (
        <MeatballMenuCopyItem
          textToCopy={`${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
            colonyName: colony.name,
          })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`}
          {...itemWrapperProps}
        >
          {children}
        </MeatballMenuCopyItem>
      ),
      icon: Copy,
    },
  ];

  return <MeatBallMenu items={multiSigMeatballOptions} />;
};

MultiSigMeatballMenu.displayName = displayName;
export default MultiSigMeatballMenu;
