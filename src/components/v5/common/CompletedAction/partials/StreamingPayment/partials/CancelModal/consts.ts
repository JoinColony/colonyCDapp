import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { type SelectBaseOption } from '~v5/common/Fields/Select/types.ts';

export const cancelDecisionMethodItems: SelectBaseOption[] = [
  {
    label: formatText({ id: 'decisionMethod.permissions' }),
    value: DecisionMethod.Permissions,
  },
];

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
  })
  .defined();
