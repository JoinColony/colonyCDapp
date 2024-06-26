import clsx from 'clsx';
import React, { type FC } from 'react';

import MenuContainer from '~v5/shared/MenuContainer/index.ts';

import RequestBoxItem from './partials/RequestBoxItem.tsx';
import { type RequestBoxProps } from './types.ts';

const RequestBox: FC<RequestBoxProps> = ({
  title,
  motions,
  withoutPadding,
}) => {
  const items = motions.map((action) => ({
    date: action.createdAt,
    transactionHash: action.transactionHash,
  }));

  return (
    <MenuContainer
      className={clsx('w-full overflow-hidden', {
        'p-[1.125rem]': !withoutPadding,
        'mb-6 !border-none': withoutPadding,
      })}
      withPadding={false}
    >
      <h5 className="mb-2 text-1">{title}</h5>
      <div className="max-h-[6.25rem] overflow-x-hidden overflow-y-scroll">
        <ul className="flex flex-col gap-2 overflow-hidden">
          {items.map(({ date, transactionHash }) => (
            <li className="w-full" key={transactionHash}>
              <RequestBoxItem
                date={date}
                transactionHash={transactionHash}
                isSingleItem={items.length === 1}
              />
            </li>
          ))}
        </ul>
      </div>
    </MenuContainer>
  );
};

export default RequestBox;
