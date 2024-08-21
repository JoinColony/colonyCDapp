import clsx from 'clsx';
import React, { type FC } from 'react';
import { FormattedDate } from 'react-intl';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { MotionState } from '~utils/colonyMotions.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';

import { type FundingRequestItemProps } from './types.ts';

const FundingRequestItem: FC<FundingRequestItemProps> = ({ action }) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();
  const { motionState, loadingAction } = useGetColonyAction(
    action.transactionHash,
  );
  const { selectedFundingAction, setSelectedFundingAction } =
    usePaymentBuilderContext();

  const isSelected =
    selectedFundingAction?.transactionHash === action.transactionHash;

  const isMotion = !!action.motionData;

  const isMotionFailed =
    motionState === MotionState.Failed ||
    motionState === MotionState.FailedNotFinalizable;

  const content = (
    <button
      type="button"
      className={clsx(
        'group flex w-full items-center justify-between outline-none transition-all',
        {
          'text-blue-400': isSelected,
          'text-gray-600': !isSelected,
        },
      )}
      onClick={() => {
        if (!isMotion || !isMotionFailed) {
          setSelectedFundingAction(action);
        } else {
          handleClipboardCopy(
            getBlockExplorerLink({
              linkType: 'tx',
              addressOrHash: action.transactionHash,
            }),
          );
        }
      }}
    >
      <span
        className={clsx('text-sm', {
          underline: isSelected,
          'group-hover:underline': isMotionFailed,
        })}
      >
        <FormattedDate
          value={new Date(action.createdAt)}
          day="numeric"
          month="short"
          year="numeric"
        />
      </span>
      {loadingAction ? (
        <SpinnerLoader />
      ) : (
        <ActionBadge
          motionState={isMotion ? motionState : MotionState.Passed}
        />
      )}
    </button>
  );

  if (isMotionFailed) {
    return (
      <Tooltip
        isOpen={isCopied}
        isSuccess
        isFullWidthContent
        placement="top"
        tooltipContent={formatText({
          id: 'colony.tooltip.url.copied',
        })}
      >
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default FundingRequestItem;
