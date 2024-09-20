import { type Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import { useCheckIfUserHasPermissions } from '../../../../hooks.ts';
import { type DecisionMethodOption } from '../../../DecisionMethodSelect/types.ts';

export const useMilestoneReleaseDecisionMethods = (
  actionType: Action,
  expenditure: Expenditure,
): DecisionMethodOption[] => {
  const { user } = useAppContext();
  const userHasPermissions = useCheckIfUserHasPermissions(actionType);
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const userIsCreator = user?.walletAddress === expenditure.ownerAddress;

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
    ...(userIsCreator
      ? [
          {
            label: formatText({ id: 'actionSidebar.method.paymentCreator' }),
            value: DecisionMethod.PaymentCreator,
          },
        ]
      : []),
  ];
};
