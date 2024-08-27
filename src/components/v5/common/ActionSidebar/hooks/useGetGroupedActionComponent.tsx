import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.ts';
import ManageColonyGroup from '../partials/ManageColonyGroup/index.ts';
import PaymentGroup from '../partials/PaymentGroup/index.ts';

const useGetGroupedActionComponent = () => {
  const { actionSidebarInitialValues } = useActionSidebarContext();
  switch (actionSidebarInitialValues?.[ACTION_TYPE_FIELD_NAME]) {
    case Action.PaymentGroup:
      return PaymentGroup;
    case Action.ManageColony:
      return ManageColonyGroup;
    default:
      return null;
  }
};

export default useGetGroupedActionComponent;
