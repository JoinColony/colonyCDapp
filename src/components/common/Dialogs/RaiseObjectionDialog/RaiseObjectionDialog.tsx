import React from 'react';
import { object, number, InferType, string } from 'yup';

import Dialog, { DialogProps } from '~shared/Dialog';
import { ActionHookForm as ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions';

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
  transform: ReturnType<typeof mapPayload>;
}

const RaiseObjectionDialog = ({
  close,
  canBeStaked,
  transform,
}: RaiseObjectionDialogProps) => {
  // const { transform, handleSuccess } = useRaiseObjectionDialog();
  return (
    <Dialog cancel={close}>
      <ActionForm<ObjectionValues>
        defaultValues={{
          amount: AMOUNT_DEFAULT,
        }}
        actionType={ActionTypes.MOTION_STAKE}
        validationSchema={validationSchema}
        transform={transform}
        // onSuccess={handleSuccess}
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
