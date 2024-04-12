import { FileDashed } from '@phosphor-icons/react';
import React, { type FC, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import { createDecisionAction } from '~redux/actionCreators/index.ts';
import { type DecisionDraft } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

import useHasNoDecisionMethods from '../../hooks/permissions/useHasNoDecisionMethods.ts';

const SaveDraftButton: FC = () => {
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  const dispatch = useDispatch();
  const {
    formState: { isValid, ...formState },
    getValues,
    trigger,
  } = useFormContext();

  const formValues = getValues();

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const handleSaveAgreementInLocalStorage = useCallback(
    (values: DecisionDraft) => {
      dispatch(
        createDecisionAction({
          ...values,
          colonyAddress: colony.colonyAddress,
        }),
      );

      setIsDraftSaved(true);

      setTimeout(() => {
        setIsDraftSaved(false);
      }, 3000);
    },
    [colony.colonyAddress, dispatch],
  );

  if (!wallet?.address) {
    return null;
  }

  return (
    <Button
      mode={isDraftSaved ? 'completed' : 'primaryOutline'}
      iconSize={18}
      onClick={() => {
        trigger();

        if (isValid) {
          handleSaveAgreementInLocalStorage({
            colonyAddress: colony.colonyAddress,
            description: formValues.description,
            title: formValues.title,
            walletAddress: wallet?.address,
            motionDomainId: formValues.motionDomainId,
          });
        }
      }}
      isFullSize={isMobile}
      disabled={formState.isValidating || isDraftSaved || hasNoDecisionMethods}
    >
      {!isDraftSaved && <FileDashed size={18} className="mr-2" />}
      {formatText({
        id: isDraftSaved ? 'button.draftSaved' : 'button.saveDraft',
      })}
    </Button>
  );
};

export default SaveDraftButton;
