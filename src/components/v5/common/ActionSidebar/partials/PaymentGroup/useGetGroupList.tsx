import { Action } from '~constants/actions.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';

import { GROUP_LIST } from './GroupList.ts';

export const useGetGroupList = () => {
  const { isStagedExpenditureEnabled } = useEnabledExtensions();
  let groupListTransformed = [...GROUP_LIST];

  if (!isStagedExpenditureEnabled) {
    groupListTransformed = groupListTransformed.map(({ action, ...rest }) => {
      return {
        ...rest,
        action,
        isHidden: action === Action.StagedPayment,
      };
    });
  }

  return groupListTransformed;
};
