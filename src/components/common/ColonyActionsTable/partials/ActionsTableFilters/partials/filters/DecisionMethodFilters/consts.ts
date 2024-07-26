import { ActivityDecisionMethod } from '~hooks/useActivityFeed/types.ts';
import { formatText } from '~utils/intl.ts';

export const DECISION_METHOD_FILTERS = [
  {
    label: formatText({ id: 'filter.permissions' }),
    name: ActivityDecisionMethod.Permissions,
  },
  {
    label: formatText({ id: 'filter.reputation' }),
    name: ActivityDecisionMethod.Reputation,
  },
  {
    label: formatText({ id: 'filter.multiSig' }),
    name: ActivityDecisionMethod.MultiSig,
  },
];
