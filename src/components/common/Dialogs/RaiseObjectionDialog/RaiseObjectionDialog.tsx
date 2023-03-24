import React from 'react';
import { object, number, InferType, string } from 'yup';

import { getStakeFromSlider } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

import Dialog, { DialogProps } from '~shared/Dialog';
import { ActionHookForm as ActionForm } from '~shared/Fields';

import { ActionTypes } from '~redux';
import { ObjectionHeading } from '.';

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
  // stakingSliderProps: StakingSliderProps;
}

const RaiseObjectionDialog = ({
  close,
}: //   stakingSliderProps: {
//     stakingWidgetSliderProps: {
//       remainingToStake,
//       minUserStake,
//       canBeStaked,
//       userActivatedTokens,
//     },
//   },
//   stakingSliderProps,
RaiseObjectionDialogProps) => {
  // const { transform, handleSuccess } = useRaiseObjectionDialog();

  return (
    <Dialog cancel={close}>
      <ActionForm<ObjectionValues>
        defaultValues={{
          amount: AMOUNT_DEFAULT,
          annotationMessage: undefined,
        }}
        actionType={ActionTypes.MOTION_STAKE}
        validationSchema={validationSchema}
        // onSuccess={handleSuccess}
        // transform={transform}
      >
        {({ formState: { isSubmitting }, watch }) => {
          const sliderAmount = watch('amount');
          //   const stake = getStakeFromSlider(
          //     sliderAmount,
          //     remainingToStake,
          //     minUserStake,
          //   );
          //  const disabled = !canBeStaked || isSubmitting;
          return (
            <>
              <ObjectionHeading />
              {/* <ObjectionSlider stakingSliderProps={stakingSliderProps} />
              <ObjectionAnnotation disabled={disabled} />
              <ObjectionControls
                cancel={close}
                disabled={disabled || userActivatedTokens.lt(stake)}
              /> */}
            </>
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

RaiseObjectionDialog.displayName = displayName;

export default RaiseObjectionDialog;
