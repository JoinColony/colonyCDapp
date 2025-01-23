import { useFormContext, type UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

export const useDraftAgreement = ({
  formContextOverride,
}: {
  formContextOverride?: UseFormReturn<object> | null;
} = {}) => {
  const formContext = useFormContext();
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  );

  const getIsDraftAgreement = () => {
    const finalFormContext = formContextOverride ?? formContext;

    if (!finalFormContext) {
      return false;
    }

    const formValues = finalFormContext.getValues();

    const selectedActionType = formValues[ACTION_TYPE_FIELD_NAME];

    return (
      selectedActionType === Action.CreateDecision &&
      formValues[TITLE_FIELD_NAME] === draftAgreement?.title &&
      formValues[DESCRIPTION_FIELD_NAME] === draftAgreement?.description &&
      formValues[CREATED_IN_FIELD_NAME] === draftAgreement?.motionDomainId
    );
  };

  return { getIsDraftAgreement, draftAgreement };
};
