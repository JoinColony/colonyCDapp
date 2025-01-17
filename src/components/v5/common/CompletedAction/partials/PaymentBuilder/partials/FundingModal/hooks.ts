import { FUND_EXPENDITURE_REQUIRED_ROLE } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
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
  const { membersByAddress } = useMemberContext();

  const { hasReputation } = membersByAddress[user?.walletAddress ?? ''] ?? {};

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
  const shouldShowReputation = isVotingReputationEnabled && hasReputation;

  return [
    {
      label: formatText({ id: 'decisionMethod.permissions' }),
      value: DecisionMethod.Permissions,
      isDisabled: !userHasFundingPermissions,
    },
    ...(shouldShowReputation
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
