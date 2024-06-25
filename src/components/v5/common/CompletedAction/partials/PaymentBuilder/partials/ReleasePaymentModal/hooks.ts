import { type Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import { useCheckIfUserHasPermissions } from '../../hooks.ts';
import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useGetReleaseDecisionMethodItems = (
  expenditure: Expenditure,
  actionType: Action,
): DecisionMethodOption[] => {
  const { user } = useAppContext();
  const isPermissionsEnabled = useCheckIfUserHasPermissions(actionType);

  const userIsCreator = user?.walletAddress === expenditure.ownerAddress;

  if (!user) {
    return [];
  }

  return [
    ...(isPermissionsEnabled || (!isPermissionsEnabled && !userIsCreator)
      ? [
          {
            label: formatText({ id: 'actionSidebar.method.permissions' }),
            value: DecisionMethod.Permissions,
            isDisabled: !isPermissionsEnabled,
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
