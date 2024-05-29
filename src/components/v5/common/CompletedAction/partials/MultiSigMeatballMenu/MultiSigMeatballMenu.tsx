import { Copy, Prohibit } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
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
  multiSigData,
}) => {
  const { colony } = useColonyContext();

  const { isRejected } = multiSigData || {};

  const cancelMultiSigMotion = useAsyncFunction({
    submit: ActionTypes.MULTISIG_CANCEL,
    error: ActionTypes.MULTISIG_CANCEL_ERROR,
    success: ActionTypes.MULTISIG_CANCEL_SUCCESS,
  });

  const handleCancelMultiSig = () => {
    cancelMultiSigMotion({
      colonyAddress: colony.colonyAddress,
      motionId: multiSigData?.nativeMultiSigId,
    });
  };

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
    ...(!isRejected
      ? [
          {
            key: '2',
            label: formatText({ id: 'multiSig.rejectAction' }),
            icon: Prohibit,
            onClick: handleCancelMultiSig,
          },
        ]
      : []),
  ];

  return <MeatBallMenu items={multiSigMeatballOptions} />;
};

MultiSigMeatballMenu.displayName = displayName;
export default MultiSigMeatballMenu;
