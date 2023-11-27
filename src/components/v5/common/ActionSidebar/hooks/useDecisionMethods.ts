import { useEnabledExtensions } from '~hooks';
import { formatText } from '~utils/intl';
import { CardSelectOption } from '~v5/common/Fields/CardSelect/types';

export const DECISION_METHOD = {
  Permissions: 'permissions',
  MultiSigPermissions: 'multi-sig-permissions',
  Reputation: 'reputation',
} as const;

export type DecisionMethod =
  (typeof DECISION_METHOD)[keyof typeof DECISION_METHOD];

export const useDecisionMethods = (): {
  decisionMethods: CardSelectOption<DecisionMethod>[];
} => {
  const { isVotingReputationEnabled } = useEnabledExtensions();

  return {
    decisionMethods: [
      {
        label: formatText({ id: 'actionSidebar.method.permissions' }),
        value: DECISION_METHOD.Permissions,
      },
      ...(isVotingReputationEnabled
        ? [
            {
              label: formatText({ id: 'actionSidebar.method.reputation' }),
              value: DECISION_METHOD.Reputation,
            },
          ]
        : []),
      // Uncomment when multisig extension is added
      // {
      //   label: formatText({ id: 'actionSidebar.method.multisig' }),
      //   value: DECISION_METHOD.MultiSigPermissions,
      // },
    ],
  };
};
