import React from 'react';

import { formatText } from '~utils/intl.ts';

import ActionGroupingList from '../ActionGroupingList/index.ts';
import ActionGroupingWrapper from '../ActionGroupingWrapper/index.ts';

import { GROUPING_LIST } from './GroupingList.ts';

const PaymentGroup = () => {
  return (
    <ActionGroupingWrapper
      title={formatText({ id: 'actions.payments' })}
      description={formatText({ id: 'actions.description.payments' })}
    >
      <ActionGroupingList color="blue" items={GROUPING_LIST} />
    </ActionGroupingWrapper>
  );
};
export default PaymentGroup;
