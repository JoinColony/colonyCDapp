import React from 'react';
import { object, number, InferType, string } from 'yup';

import { ActionTypes } from '~redux';
import Dialog, { DialogProps } from '~shared/Dialog';
import { ActionForm, OnSuccess } from '~shared/Fields';
import { SetStateFn } from '~types';
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
    annotation: string(),
  })
  .defined();

type ObjectionValues = InferType<typeof validationSchema>;

interface RaiseObjectionDialogProps extends DialogProps {
  handleStakeSuccess: OnSuccess<ObjectionValues>;
  transform: ReturnType<typeof mapPayload>;
  setIsSummary: SetStateFn;
  amount: number;
  isDecision: boolean;
}

const RaiseObjectionDialog = ({
  close,
  handleStakeSuccess,
  transform,
  setIsSummary,
  amount,
  isDecision,
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
          annotation: '',
        }}
        actionType={ActionTypes.MOTION_STAKE}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={handleSuccess}
      >
        {({ formState: { isSubmitting } }) => {
          return (
            <>
              <ObjectionHeading />
              <ObjectionSlider />
              <ObjectionAnnotation
                disabled={isSubmitting}
                isDecision={isDecision}
              />
              <ObjectionControls cancel={close} disabled={isSubmitting} />
            </>
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

RaiseObjectionDialog.displayName = displayName;

export default RaiseObjectionDialog;
