import { Action } from '~constants/actions.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

import { useCheckIfUserHasPermissions } from '../../hooks.ts';
import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useCancelingDecisionMethods = (): DecisionMethodOption[] => {
  const userHasPermissions = useCheckIfUserHasPermissions(
    Action.PaymentBuilder,
  );
  const { isVotingReputationEnabled } = useEnabledExtensions();

  return [
    {
      label: formatText({ id: 'decisionMethodSelect.decision.permissions' }),
      value: DecisionMethod.Permissions,
      isDisabled: !userHasPermissions,
    },
    ...(isVotingReputationEnabled
      ? [
          {
            label: formatText({
              id: 'decisionMethodSelect.decision.reputation',
            }),
            value: DecisionMethod.Reputation,
          },
        ]
      : []),
  ];
};
