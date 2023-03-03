import React from 'react';
import { object, number, InferType, string } from 'yup';

import {
  StakingSliderProps,
  SLIDER_AMOUNT_KEY,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

import Dialog, { DialogProps } from '~shared/Dialog';
import { ActionHookForm as ActionForm } from '~shared/Fields';
import { useRaiseObjectionDialog } from '~hooks';
import { ActionTypes } from '~redux';
import { Address, SetStateFn } from '~types';

import {
  ObjectionHeading,
  ObjectionAnnotation,
  ObjectionControls,
  ObjectionSlider,
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

interface RaiseObjectionDialogCoreProps {
  motionId: string;
  setIsSummary: SetStateFn;
  setMotionStakes: SetStateFn;
  setUsersStakes: SetStateFn;
  colonyAddress: Address;
  defaultSliderAmount: number;
}

interface RaiseObjectionDialogProps extends DialogProps {
  stakingSliderProps: StakingSliderProps;
  raiseObjectionDialogProps: RaiseObjectionDialogCoreProps;
}

const RaiseObjectionDialog = ({
  close,
  stakingSliderProps: {
    stakingWidgetSliderProps: {
      canBeStaked,
      minUserStake,
      remainingToStake: remainingToFullyNayStaked,
    },
  },
  stakingSliderProps,
  raiseObjectionDialogProps,
  raiseObjectionDialogProps: { defaultSliderAmount },
}: RaiseObjectionDialogProps) => {
  const { transform, handleSuccess } = useRaiseObjectionDialog(close, {
    ...raiseObjectionDialogProps,
    minUserStake,
    remainingToFullyNayStaked,
  });

  return (
    <Dialog cancel={close}>
      <ActionForm<ObjectionValues>
        defaultValues={{
          [SLIDER_AMOUNT_KEY]: defaultSliderAmount,
          annotationMessage: undefined,
        }}
        actionType={ActionTypes.MOTION_STAKE}
        validationSchema={validationSchema}
        onSuccess={handleSuccess}
        transform={transform}
      >
        {({ formState: { isSubmitting } }) => {
          const disabled = !canBeStaked || isSubmitting;
          return (
            <>
              <ObjectionHeading />
              <ObjectionSlider stakingSliderProps={stakingSliderProps} />
              <ObjectionAnnotation disabled={disabled} />
              <ObjectionControls cancel={close} disabled={disabled} />
            </>
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

RaiseObjectionDialog.displayName = displayName;

export default RaiseObjectionDialog;
