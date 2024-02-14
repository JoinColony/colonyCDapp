import React from 'react';
import { FormattedMessage } from 'react-intl';

import { type CardSelectOption } from '../../Fields/CardSelect/types.ts';

export const DISTRIBUTION_METHOD = {
  Equal: 'equal',
  Unequal: 'unequal',
  ReputationPercentage: 'reputation-percentage',
} as const;

export type DistributionMethod =
  (typeof DISTRIBUTION_METHOD)[keyof typeof DISTRIBUTION_METHOD];

export const DISTRIBUTION_METHOD_OPTIONS: CardSelectOption<string>[] = [
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.equal" />,
    value: DISTRIBUTION_METHOD.Equal,
  },
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.unequal" />,
    value: DISTRIBUTION_METHOD.Unequal,
  },
  {
    label: (
      <FormattedMessage id="actionSidebar.distributionTypes.reputationPercentage" />
    ),
    value: DISTRIBUTION_METHOD.ReputationPercentage,
  },
];
