import { DecisionMethod } from '~gql';
import { formatText } from '~utils/intl.ts';

export const DECISION_METHOD_FILTERS = [
  {
    label: formatText({ id: 'filter.permissions' }),
    name: DecisionMethod.Permissions,
  },
  {
    label: formatText({ id: 'filter.reputation' }),
    name: DecisionMethod.Reputation,
  },
  {
    label: formatText({ id: 'filter.multiSig' }),
    name: DecisionMethod.MultiSig,
  },
];
