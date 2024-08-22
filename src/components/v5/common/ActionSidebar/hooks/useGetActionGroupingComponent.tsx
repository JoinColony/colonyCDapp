import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.ts';
import PaymentGroup from '../partials/PaymentGroup/index.ts';

const useGetActionGroupingComponent = () => {
  const { actionSidebarInitialValues } = useActionSidebarContext();
  switch (actionSidebarInitialValues?.[ACTION_TYPE_FIELD_NAME]) {
    case Action.PaymentGroup:
      return PaymentGroup;
    default:
      return null;
  }
};

export default useGetActionGroupingComponent;
