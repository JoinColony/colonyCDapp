import React, { type FC } from 'react';

import MenuContainer from '~v5/shared/MenuContainer/MenuContainer.tsx';

import RequestsBoxItem from './RequestsBoxItem.tsx';
import { type RequestsBoxProps } from './types.ts';

const RequestsBox: FC<RequestsBoxProps> = ({
  actions,
  onClick,
  selectedAction,
  title,
}) => {
  return (
    <MenuContainer
      className="w-full overflow-hidden p-[1.125rem]"
      withPadding={false}
    >
      <h5 className="mb-2 text-1">{title}</h5>
      <ul className="max-h-[6.25rem] overflow-y-auto overflow-x-hidden">
        {actions.map((action) => (
          <li className="mb-2 w-full last:mb-0" key={action.transactionHash}>
            <RequestsBoxItem
              action={action}
              selectedAction={selectedAction}
              onClick={onClick}
            />
          </li>
        ))}
      </ul>
    </MenuContainer>
  );
};

export default RequestsBox;
