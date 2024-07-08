import React, { type FC, useState } from 'react';

import { formatText } from '~utils/intl.ts';
import { TextButton } from '~v5/shared/Button/index.ts';

import { REVEAL_INFORMATION_LIST_MAX_ITEMS } from './consts.ts';
import RevealInformationItem from './RevealInformationItem/index.ts';
import { type RevealInformationListProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.RevealStep.partials.RevealInformationList';

const RevealInformationList: FC<RevealInformationListProps> = ({ items }) => {
  const [itemsLength, setItemsLength] = useState(
    REVEAL_INFORMATION_LIST_MAX_ITEMS,
  );

  const itemsToShow = items.slice(0, itemsLength);
  const shouldShowButton =
    items.length > REVEAL_INFORMATION_LIST_MAX_ITEMS &&
    itemsLength < items.length;

  return (
    <div>
      <ul className="pt-6">
        {itemsToShow.map(({ address, hasRevealed }) => (
          <li key={address} className="mb-3 last:mb-0">
            <RevealInformationItem
              address={address}
              hasRevealed={hasRevealed}
            />
          </li>
        ))}
      </ul>
      {shouldShowButton && (
        <TextButton
          className="mt-6 w-full justify-center"
          text={formatText({ id: 'loadMore' })}
          onClick={() => setItemsLength(itemsLength + 6)}
        />
      )}
    </div>
  );
};

RevealInformationList.displayName = displayName;

export default RevealInformationList;
