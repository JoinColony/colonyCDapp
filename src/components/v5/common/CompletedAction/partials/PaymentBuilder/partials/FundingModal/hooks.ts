import { FUND_EXPENDITURE_REQUIRED_ROLE } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { formatText } from '~utils/intl.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useFundingDecisionMethods = (
  fundingDomainId: number,
): DecisionMethodOption[] => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { isVotingReputationEnabled, isMultiSigEnabled } =
    useEnabledExtensions();

  const userHasFundingPermissions = user
    ? addressHasRoles({
        colony,
        address: user.walletAddress,
        requiredRoles: [FUND_EXPENDITURE_REQUIRED_ROLE],
        requiredRolesDomain: fundingDomainId,
      })
    : false;

  const userHasMultiSigPermissions = user
    ? addressHasRoles({
        colony,
        address: user.walletAddress,
        requiredRoles: [FUND_EXPENDITURE_REQUIRED_ROLE],
        requiredRolesDomain: fundingDomainId,
        isMultiSig: true,
      })
    : false;
  const shouldShowMultiSig = isMultiSigEnabled && userHasMultiSigPermissions;

  return [
    {
      label: formatText({ id: 'decisionMethod.permissions' }),
      value: DecisionMethod.Permissions,
      isDisabled: !userHasFundingPermissions,
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
    ...(shouldShowMultiSig
      ? [
          {
            label: formatText({
              id: 'decisionMethod.multiSig',
            }),
            value: DecisionMethod.MultiSig,
          },
        ]
      : []),
  ];
};
