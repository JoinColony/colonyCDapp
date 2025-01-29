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
import { REPUTATION_VALIDATION_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import Button from '~v5/shared/Button/index.ts';

const SaveDraftButton: FC = () => {
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const isMobile = useMobile();
  const { colony, refetchColony } = useColonyContext();
  const { wallet } = useAppContext();
  const dispatch = useDispatch();
  const {
    watch,
    formState: { isValidating, errors },
    trigger,
  } = useFormContext();

  const formValues = watch();

  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const isDisabled = isValidating || isDraftSaved || hasNoDecisionMethods;

  const handleSaveAgreementInLocalStorage = useCallback(
    (values: DecisionDraft) => {
      dispatch(
        createDecisionAction({
          ...values,
          colonyAddress: colony.colonyAddress,
        }),
      );

      setIsDraftSaved(true);
      refetchColony();

      setTimeout(() => {
        setIsDraftSaved(false);
      }, 3000);
    },
    [colony.colonyAddress, dispatch, refetchColony],
  );

  const handleClick = () => {
    trigger().then((isValid) => {
      const hasOnlyMissingReputationError = Object.keys(errors).every(
        (errorKey) => errorKey === REPUTATION_VALIDATION_FIELD_NAME,
      );
      if (isValid || hasOnlyMissingReputationError) {
        handleSaveAgreementInLocalStorage({
          colonyAddress: colony.colonyAddress,
          description: formValues.description,
          title: formValues.title,
          walletAddress: wallet?.address ?? '',
          motionDomainId: formValues.motionDomainId,
        });
      }
    });
  };

  if (!wallet?.address) {
    return null;
  }

  return (
    <Button
      mode={isDraftSaved ? 'completed' : 'primaryOutline'}
      iconSize={18}
      onClick={handleClick}
      isFullSize={isMobile}
      disabled={isDisabled}
    >
      {!isDraftSaved && <FileDashed size={18} />}
      {formatText({
        id: isDraftSaved ? 'button.draftSaved' : 'button.saveDraft',
      })}
    </Button>
  );
};

export default SaveDraftButton;
