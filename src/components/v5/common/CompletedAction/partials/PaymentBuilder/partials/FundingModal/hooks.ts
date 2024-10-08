import { type Action } from '~constants/actions.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { useCheckIfUserHasPermissions } from '~v5/common/CompletedAction/partials/PaymentBuilder/hooks.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useFundingDecisionMethods = (
  actionType: Action,
): DecisionMethodOption[] => {
  const userHasPermissions = useCheckIfUserHasPermissions(actionType);
  const { isVotingReputationEnabled } = useEnabledExtensions();

  return [
    {
      label: formatText({ id: 'decisionMethod.permissions' }),
      value: DecisionMethod.Permissions,
      isDisabled: !userHasPermissions,
    },
    ...(isVotingReputationEnabled
      ? [
          {
            label: formatText({
              id: 'decisionMethod.reputation',
            }),
            value: DecisionMethod.Reputation,
          },
        ]
      : []),
  ];
};
