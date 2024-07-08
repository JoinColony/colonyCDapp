import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';

import ManageColonyGroup from '../partials/ManageColonyGroup/index.ts';
import PaymentGroup from '../partials/PaymentGroup/index.ts';

const useGetGroupedActionComponent = () => {
  const {
    data: { action },
  } = useActionSidebarContext();
  switch (action) {
    // FIXME: Take these out of the Action and use a separate enum
    case Action.PaymentGroup:
      return PaymentGroup;
    case Action.ManageColony:
      return ManageColonyGroup;
    default:
      return null;
  }
};

export default useGetGroupedActionComponent;
