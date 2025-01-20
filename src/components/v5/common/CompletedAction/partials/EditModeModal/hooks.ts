import { Action } from '~constants/actions.ts';
// import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

import { useCheckIfUserHasPermissions } from '../PaymentBuilder/hooks.ts';
import { type DecisionMethodOption } from '../PaymentBuilder/partials/DecisionMethodSelect/types.ts';

export const useEditDecisionMethods = (): DecisionMethodOption[] => {
  const userHasPermissions = useCheckIfUserHasPermissions(
    Action.PaymentBuilder,
  );
  // const { isVotingReputationEnabled } = useEnabledExtensions();

  return [
    {
      label: formatText({ id: 'decisionMethod.permissions' }),
      value: DecisionMethod.Permissions,
      isDisabled: !userHasPermissions,
    },
    // ...(isVotingReputationEnabled
    //   ? [
    //       {
    //         label: formatText({
    //           id: 'decisionMethod.reputation',
    //         }),
    //         value: DecisionMethod.Reputation,
    //       },
    //     ]
    //   : []),
  ];
};
