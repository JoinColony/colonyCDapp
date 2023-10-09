import React, { FC } from 'react';

import RevealInformationItem from './RevealInformationItem';

import { RevealInformationListProps } from './types';

const RevealInformationList: FC<RevealInformationListProps> = ({ items }) => (
  <ul>
    {items.map(({ address, hasRevealed }) => (
      <li key={address} className="mb-3 last:mb-0">
        <RevealInformationItem address={address} hasRevealed={hasRevealed} />
      </li>
    ))}
  </ul>
);

export default RevealInformationList;
