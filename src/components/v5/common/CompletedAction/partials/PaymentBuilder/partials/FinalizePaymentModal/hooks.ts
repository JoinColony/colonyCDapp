import { type Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { useCheckIfUserHasPermissions } from '~v5/common/CompletedAction/partials/PaymentBuilder/hooks.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useGetFinalizeDecisionMethodItems = (
  expenditure: Expenditure,
  actionType: Action,
): DecisionMethodOption[] => {
  const { user } = useAppContext();
  const isPermissionsEnabled = useCheckIfUserHasPermissions(actionType);
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const userIsCreator = user?.walletAddress === expenditure.ownerAddress;

  if (!user) {
    return [];
  }

  return [
    ...(isPermissionsEnabled || (!isPermissionsEnabled && !userIsCreator)
      ? [
          {
            label: formatText({ id: 'decisionMethod.permissions' }),
            value: DecisionMethod.Permissions,
            isDisabled: !isPermissionsEnabled,
          },
        ]
      : []),
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
    ...(userIsCreator
      ? [
          {
            label: formatText({ id: 'decisionMethod.paymentCreator' }),
            value: DecisionMethod.PaymentCreator,
          },
        ]
      : []),
  ];
};
