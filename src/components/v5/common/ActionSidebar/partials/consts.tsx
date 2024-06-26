import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SplitPaymentDistributionType } from '~gql';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export const distributionMethodOptions: CardSelectOption<string>[] = [
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.equal" />,
    value: SplitPaymentDistributionType.Equal,
  },
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.unequal" />,
    value: SplitPaymentDistributionType.Unequal,
  },
  {
    label: (
      <FormattedMessage id="actionSidebar.distributionTypes.reputationPercentage" />
    ),
    value: SplitPaymentDistributionType.Reputation,
  },
];
