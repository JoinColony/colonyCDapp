import { ColonyRole } from '@colony/colony-js';
import { object, string } from 'yup';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import { type Expenditure } from '~types/graphql.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { formatText } from '~utils/intl.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useGetReleaseDecisionMethodItems = (
  expenditure: Expenditure,
): DecisionMethodOption[] => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  if (!user) {
    return [];
  }

  const isPermissionsEnabled = addressHasRoles({
    address: user.walletAddress,
    colony,
    requiredRoles: [ColonyRole.Arbitration],
    requiredRolesDomain: expenditure.nativeDomainId,
  });

  return [
    {
      label: 'Permissions',
      value: DecisionMethod.Permissions,
      isDisabled: !isPermissionsEnabled,
    },
  ];
};

export const releaseDecisionMethodDescriptions = {
  [DecisionMethod.Permissions]: formatText({
    id: 'releaseModal.permissionsDescription',
  }),
};

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
  })
  .defined();
