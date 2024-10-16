import { object, string } from 'yup';

import { DecisionMethod } from '~gql';
import { formatText } from '~utils/intl.ts';
import { type SelectBaseOption } from '~v5/common/Fields/Select/types.ts';

export const cancelDecisionMethodItems: SelectBaseOption[] = [
  {
    label: formatText({ id: 'decisionMethodSelect.decision.permissions' }),
    value: DecisionMethod.Permissions,
  },
];

export const cancelDecisionMethodDescriptions = {
  [DecisionMethod.Permissions]: formatText({
    id: 'cancelModal.permissionsDescription',
  }),
};

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
  })
  .defined();
