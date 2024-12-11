import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import MenuContainer from '~v5/shared/MenuContainer/MenuContainer.tsx';

import FundingRequestItem from './FundingRequestItem.tsx';
import { type FundingRequestsProps } from './types.ts';

const FundingRequests: FC<FundingRequestsProps> = ({ actions }) => {
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
        {actions.map((action) => (
          <li className="mb-2 w-full last:mb-0" key={action.transactionHash}>
            <FundingRequestItem
              action={action}
              isOnlyItem={actions.length === 1}
            />
          </li>
        ))}
      </ul>
    </MenuContainer>
  );
};

export default FundingRequests;
