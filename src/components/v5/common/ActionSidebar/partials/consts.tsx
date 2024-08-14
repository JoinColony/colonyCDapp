import React from 'react';
import { FormattedMessage } from 'react-intl';

import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export enum DistributionMethod {
  Equal = 'equal',
  Unequal = 'unequal',
  ReputationPercentage = 'reputation-percentage',
}

export const DistributionMethodOptions: CardSelectOption<string>[] = [
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.equal" />,
    value: DistributionMethod.Equal,
  },
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.unequal" />,
    value: DistributionMethod.Unequal,
  },
  {
    label: (
      <FormattedMessage id="actionSidebar.distributionTypes.reputationPercentage" />
    ),
    value: DistributionMethod.ReputationPercentage,
  },
];
