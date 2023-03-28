import React from 'react';
import { object, number, InferType, string } from 'yup';

import Dialog, { DialogProps } from '~shared/Dialog';
import { ActionHookForm as ActionForm, OnSuccess } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions';

import { SetStateFn } from '~types';
import {
  ObjectionHeading,
  ObjectionSlider,
  ObjectionControls,
  ObjectionAnnotation,
} from '.';

const displayName = 'common.Dialogs.RaiseObjectionDialog';

const AMOUNT_DEFAULT = 0;

const validationSchema = object()
  .shape({
    amount: number().required().default(AMOUNT_DEFAULT),
    annotationMessage: string(),
  })
  .defined();

type ObjectionValues = InferType<typeof validationSchema>;

interface RaiseObjectionDialogProps extends DialogProps {
  canBeStaked: boolean;
  handleStakeSuccess: OnSuccess<ObjectionValues>;
  transform: ReturnType<typeof mapPayload>;
  setIsSummary: SetStateFn;
  amount: number;
}

const RaiseObjectionDialog = ({
  close,
  canBeStaked,
  handleStakeSuccess,
  transform,
  setIsSummary,
  amount,
}: RaiseObjectionDialogProps) => {
  const handleSuccess: OnSuccess<ObjectionValues> = (...args) => {
    handleStakeSuccess(...args);
    setIsSummary(true);
    close();
  };

  return (
    <Dialog cancel={close}>
      <ActionForm<ObjectionValues>
        defaultValues={{
          amount,
        }}
        actionType={ActionTypes.MOTION_STAKE}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={handleSuccess}
      >
        {({ formState: { isSubmitting } /* watch */ }) => {
          // const sliderAmount = watch('amount');
          //   const stake = getStakeFromSlider(
          //     sliderAmount,
          //     remainingToStake,
          //     minUserStake,
          //   );
          const disabled = !canBeStaked || isSubmitting;
          return (
            <>
              <ObjectionHeading />
              <ObjectionSlider canBeStaked={canBeStaked} />
              <ObjectionAnnotation disabled={disabled} />
              <ObjectionControls
                cancel={close}
                disabled={disabled /* || userActivatedTokens.lt(stake) */}
              />
            </>
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

RaiseObjectionDialog.displayName = displayName;

export default RaiseObjectionDialog;
