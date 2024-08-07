import React, { type FC } from 'react';
import { FormattedDate } from 'react-intl';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import MenuContainer from '~v5/shared/MenuContainer/MenuContainer.tsx';

import { type PermissionsBoxProps } from './types.ts';

const PermissionsBox: FC<PermissionsBoxProps> = ({ items }) => {
  const { setSelectedPermissionAction } = usePaymentBuilderContext();

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
        {items.map(({ createdAt, initiatorAddress }) => (
          <li className="mb-2 w-full last:mb-0" key={createdAt}>
            <button
              type="button"
              className="group flex w-full items-center justify-between text-gray-600 outline-none transition-all hover:text-blue-400"
              onClick={() =>
                setSelectedPermissionAction({ createdAt, initiatorAddress })
              }
            >
              <span className="text-sm group-hover:underline">
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
        ))}
      </ul>
    </MenuContainer>
  );
};

export default PermissionsBox;
