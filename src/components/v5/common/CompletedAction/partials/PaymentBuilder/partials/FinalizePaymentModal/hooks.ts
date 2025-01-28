import { ColonyRole } from '@colony/colony-js';

import { UserRole, type UserRoleMeta } from '~constants/permissions.ts';
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

  const userIsCreator = user?.walletAddress === expenditure.ownerAddress;

  const hasUserPermissions =
    userRole?.role === UserRole.Payer ||
    (userRole?.role === UserRole.Custom &&
      userRole.permissions.some(
        (permission) => permission === ColonyRole.Arbitration,
      ));

  if (!user) {
    return [];
  }

  return [
    ...(hasUserPermissions
      ? [
          {
            label: formatText({ id: 'decisionMethod.permissions' }),
            value: DecisionMethod.Permissions,
            isDisabled: !hasUserPermissions,
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
