import { type UserRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useGetFinalizeDecisionMethodItems = (
  expenditure: Expenditure,
  userRole?: UserRole,
): DecisionMethodOption[] => {
  const { user } = useAppContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const userIsCreator =
    userRole === 'owner' || userRole === 'payer' || userRole === 'custom';

  if (!user) {
    return [];
  }

  return [
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
