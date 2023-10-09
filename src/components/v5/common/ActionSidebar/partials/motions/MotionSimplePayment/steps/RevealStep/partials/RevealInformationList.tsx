import React, { FC, useState } from 'react';

import RevealInformationItem from './RevealInformationItem';

import { RevealInformationListProps } from './types';
import { TextButton } from '~v5/shared/Button';
import { formatText } from '~utils/intl';

const RevealInformationList: FC<RevealInformationListProps> = ({ items }) => {
  const [itemsLength, setItemsLength] = useState(6);

  const itemsToShow = items.slice(0, itemsLength);
  const shouldShowButton = items.length > 6 && itemsLength < items.length;

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

export default RevealInformationList;
