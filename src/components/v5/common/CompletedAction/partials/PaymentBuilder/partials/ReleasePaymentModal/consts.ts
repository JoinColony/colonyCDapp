import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { type SelectBaseOption } from '~v5/common/Fields/Select/types.ts';

export const releaseDecisionMethodItems: SelectBaseOption[] = [
  {
    label: 'Permissions',
    value: DecisionMethod.Permissions,
  },
];

export const releaseDecisionMethodDescriptions = {
  [DecisionMethod.Permissions]: formatText({
    id: 'releaseModal.permissionsDescription',
  }),
};
