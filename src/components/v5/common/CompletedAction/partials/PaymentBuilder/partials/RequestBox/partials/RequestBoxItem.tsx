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

import { type RequestBoxItemProps } from './types.ts';

const RequestBoxItem: FC<RequestBoxItemProps> = ({
  date,
  transactionHash,
  isSingleItem,
}) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();
  const { motionState, loadingAction } = useGetColonyAction(transactionHash);
  const { setSelectedTransaction } = usePaymentBuilderContext();

  const isMotionFailed =
    motionState === MotionState.Failed ||
    motionState === MotionState.FailedNotFinalizable;

  const content = (
    <button
      type="button"
      className={clsx(
        'group flex w-full items-center justify-between text-gray-600 outline-none transition-all',
        {
          'hover:text-blue-400': isMotionFailed || !isSingleItem,
        },
      )}
      onClick={() => {
        if (!isMotionFailed) {
          setSelectedTransaction(transactionHash);
        } else {
          handleClipboardCopy(
            getBlockExplorerLink({
              linkType: 'tx',
              addressOrHash: transactionHash,
            }),
          );
        }
      }}
    >
      <span
        className={clsx('text-sm', {
          'group-hover:underline': isMotionFailed || !isSingleItem,
        })}
      >
        <FormattedDate
          value={new Date(date)}
          day="numeric"
          month="short"
          year="numeric"
        />
      </span>
      {loadingAction ? (
        <SpinnerLoader />
      ) : (
        <ActionBadge motionState={motionState} />
      )}
    </button>
  );

  if (!isMotionFailed) {
    return content;
  }

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
};

export default RequestBoxItem;
