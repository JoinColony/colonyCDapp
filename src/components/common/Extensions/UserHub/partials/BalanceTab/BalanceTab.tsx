import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { formatText } from '~utils/intl.ts';

import BalanceInfoRow from './partials/BalanceInfoRow/BalanceInfoRow.tsx';
import StreamsInfoRow from './partials/StreamsInfoRow/StreamsInfoRow.tsx';
import { type BalanceTabProps } from './types.ts';

const displayName = 'common.Extensions.UserHub.partials.BalanceTab';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Your overview in {colonyName}',
  },
  titleColonyOverview: {
    id: `${displayName}.titleColonyOverview`,
    defaultMessage: 'Your overview',
  },
});

const BalanceTab: FC<BalanceTabProps> = ({ onTabChange }) => {
  const { colony } = useColonyContext();
  const { metadata, nativeToken } = colony;
  const { displayName: colonyDisplayName = '' } = metadata || {};

  const { wallet } = useAppContext();

  if (!wallet) {
    return null;
  }

  return (
    <div className="p-6">
      <h5 className="mb-6 heading-5 sm:mb-4">
        {formatText(MSG.title, { colonyName: colonyDisplayName })}
      </h5>
      <BalanceInfoRow
        nativeToken={nativeToken}
        wallet={wallet}
        onTabChange={onTabChange}
        className="mb-6 border-b border-gray-200 pb-6"
      />
      <StreamsInfoRow />
    </div>
  );
};

BalanceTab.displayName = displayName;
export default BalanceTab;
