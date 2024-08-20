import clsx from 'clsx';
import React, { type FC } from 'react';
import { FormattedDate } from 'react-intl';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import MenuContainer from '~v5/shared/MenuContainer/MenuContainer.tsx';

import { type FundingRequestsProps } from './types.ts';

const FundingRequests: FC<FundingRequestsProps> = ({ actions }) => {
  const { selectedPermissionAction, setSelectedPermissionAction } =
    usePaymentBuilderContext();

  return (
    <MenuContainer
      className="w-full overflow-hidden p-[1.125rem]"
      withPadding={false}
    >
      <h5 className="mb-2 text-1">
        {formatText({
          id: 'expenditure.fundingRequest.title',
        })}
      </h5>
      <ul className="max-h-[6.25rem] overflow-y-auto overflow-x-hidden">
        {actions.map((action) => {
          const { transactionHash, createdAt } = action;
          const isSelected =
            selectedPermissionAction?.transactionHash === transactionHash;

          return (
            <li className="mb-2 w-full last:mb-0" key={transactionHash}>
              <button
                type="button"
                className={clsx(
                  'group flex w-full items-center justify-between outline-none transition-all hover:text-blue-400',
                  {
                    'text-blue-400': isSelected,
                    'text-gray-600': !isSelected,
                  },
                )}
                onClick={() => setSelectedPermissionAction(action)}
              >
                <span
                  className={clsx('text-sm group-hover:underline', {
                    underline: isSelected,
                  })}
                >
                  <FormattedDate
                    value={new Date(createdAt)}
                    day="numeric"
                    month="short"
                    year="numeric"
                  />
                </span>
                <ActionBadge motionState={MotionState.Passed} />
              </button>
            </li>
          );
        })}
      </ul>
    </MenuContainer>
  );
};

export default FundingRequests;
