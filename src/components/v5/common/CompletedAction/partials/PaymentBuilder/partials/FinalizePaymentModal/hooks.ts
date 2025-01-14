import { ColonyRole } from '@colony/colony-js';

import { type UserRoleMeta } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useGetFinalizeDecisionMethodItems = (
  expenditure: Expenditure,
  userRole?: UserRoleMeta,
): DecisionMethodOption[] => {
  const { user } = useAppContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const userIsCreator =
    userRole?.role === 'owner' ||
    userRole?.role === 'payer' ||
    (userRole?.role === 'custom' &&
      userRole.permissions.some(
        (permission) => permission === ColonyRole.Arbitration,
      ));

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
