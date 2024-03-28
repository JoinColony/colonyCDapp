import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { type SelectBaseOption } from '~v5/common/Fields/Select/types.ts';

export const fundingDecisionMethodItems: SelectBaseOption[] = [
  {
    label: formatText({ id: 'decisionMethodSelect.decision.permissions' }),
    value: DecisionMethod.Permissions,
  },
];

export const fundingDecisionMethodDescriptions = {
  [DecisionMethod.Permissions]: formatText({
    id: 'fundingModal.permissionsDescription',
  }),
};
