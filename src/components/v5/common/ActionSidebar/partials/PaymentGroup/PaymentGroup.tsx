import React from 'react';

import { formatText } from '~utils/intl.ts';

import GroupedActionList from '../GroupedActionList/index.ts';
import GroupedActionWrapper from '../GroupedActionWrapper/index.ts';

import { GROUP_LIST } from './GroupList.ts';

const PaymentGroup = () => {
  return (
    <GroupedActionWrapper
      title={formatText({ id: 'actions.payments' })}
      description={formatText({ id: 'actions.description.payments' })}
    >
      <GroupedActionList color="blue" items={GROUP_LIST} />
    </GroupedActionWrapper>
  );
};
export default PaymentGroup;
