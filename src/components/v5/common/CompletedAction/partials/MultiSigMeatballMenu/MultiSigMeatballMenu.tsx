import { Copy, Prohibit } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { generatePath } from 'react-router-dom';

import MeatballMenuCopyItem from '~common/ColonyActionsTable/partials/MeatballMenuCopyItem/MeatballMenuCopyItem.tsx';
import { APP_URL } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCompletedActionContext } from '~context/CompletedActionContext/CompletedActionContext.ts';
import { MultiSigVote } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { type VoteOnMultiSigActionPayload } from '~redux/sagas/multiSig/voteOnMultiSig.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';

import { type MultiSigMeatballMenuProps } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.MultiSigMeatballMenu';

const MultiSigMeatballMenu: FC<MultiSigMeatballMenuProps> = ({
  transactionHash,
  multiSigData,
  isOwner,
  actionType,
}) => {
  const { colony } = useColonyContext();
  const { showRejectMultiSigStep, setShowRejectMultiSigStep } =
    useCompletedActionContext();

  const { isRejected, nativeMultiSigDomainId, nativeMultiSigId } =
    multiSigData || {};

  const cancelMultiSigMotion = useAsyncFunction({
    submit: ActionTypes.MULTISIG_CANCEL,
    error: ActionTypes.MULTISIG_CANCEL_ERROR,
    success: ActionTypes.MULTISIG_CANCEL_SUCCESS,
  });

  const voteOnMultiSig = useAsyncFunction({
    submit: ActionTypes.MULTISIG_VOTE,
    error: ActionTypes.MULTISIG_VOTE_ERROR,
    success: ActionTypes.MULTISIG_VOTE_SUCCESS,
  });

  const handleCancelMultiSigAsOwner = () => {
    cancelMultiSigMotion({
      colonyAddress: colony.colonyAddress,
      motionId: multiSigData?.nativeMultiSigId,
    });
  };

  const handleRejectMultiSig = async () => {
    const voteForPayload: VoteOnMultiSigActionPayload = {
      colonyAddress: colony.colonyAddress,
      colonyDomains: extractColonyDomains(colony.domains),
      colonyRoles: extractColonyRoles(colony.roles),
      vote: MultiSigVote.Reject,
      domainId: Number(nativeMultiSigDomainId),
      multiSigId: nativeMultiSigId,
      requiredRole: getMultiSigRequiredRole(actionType),
    };

    await voteOnMultiSig(voteForPayload);
    setShowRejectMultiSigStep(true);
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
    ...(!isRejected && isOwner
      ? [
          {
            key: '2',
            label: formatText({ id: 'multiSig.rejectAction' }),
            icon: Prohibit,
            onClick: handleCancelMultiSigAsOwner,
          },
        ]
      : []),
    ...(!isRejected && !isOwner && !showRejectMultiSigStep
      ? [
          {
            key: '2',
            label: formatText({ id: 'multiSig.rejectAction' }),
            icon: Prohibit,
            onClick: handleRejectMultiSig,
          },
        ]
      : []),
  ];

  return <MeatBallMenu items={multiSigMeatballOptions} />;
};

MultiSigMeatballMenu.displayName = displayName;
export default MultiSigMeatballMenu;
