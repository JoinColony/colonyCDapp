import React, { type FC } from 'react';

import MenuContainer from '~v5/shared/MenuContainer/index.ts';

import RequestBoxItem from './partials/RequestBoxItem.tsx';
import { type RequestBoxProps } from './types.ts';

const RequestBox: FC<RequestBoxProps> = ({ title, items }) => {
  return (
    <MenuContainer
      className="w-full overflow-hidden p-[1.125rem]"
      withPadding={false}
    >
      <h5 className="mb-2 text-1">{title}</h5>
      {items.map(({ date, motionState, transactionHash, key }) => (
        <div className="mb-2 w-full last:mb-0" key={key}>
          <RequestBoxItem
            date={date}
            motionState={motionState}
            transactionHash={transactionHash}
          />
        </div>
      ))}
    </MenuContainer>
  );
};

export default RequestBox;
