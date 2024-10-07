import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const getCancelDecisionMethodDescriptions = (role: string) => ({
  [DecisionMethod.Permissions]: formatText(
    {
      id: 'cancelModal.permissionsDescription',
    },
    { role },
  ),
});
