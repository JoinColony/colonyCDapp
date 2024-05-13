import { ColonyRole } from '@colony/colony-js';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { formatText } from '~utils/intl.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useGetReleaseDecisionMethodItems = (
  expenditure: Expenditure,
): DecisionMethodOption[] => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const userIsCreator = user?.walletAddress === expenditure.ownerAddress;

  if (!user) {
    return [];
  }

  const isPermissionsEnabled = addressHasRoles({
    address: user.walletAddress,
    colony,
    requiredRoles: [ColonyRole.Arbitration],
    requiredRolesDomains: [expenditure.nativeDomainId],
  });

  return [
    {
      label: formatText({ id: 'actionSidebar.method.permissions' }),
      value: DecisionMethod.Permissions,
      isDisabled: !isPermissionsEnabled,
    },
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
