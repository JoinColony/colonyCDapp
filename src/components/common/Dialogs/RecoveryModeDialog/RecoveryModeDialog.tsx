import React, { useCallback } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import Dialog, { DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { useAppContext, WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { Colony } from '~types';

import DialogForm from './RecoveryModeDialogForm';

export interface FormValues {
  annotation: string;
}

interface CustomWizardDialogProps {
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'common.ColonyHome.RecoveryModeDialog';

const RecoveryModeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony: { name, colonyAddress },
  colony,
}: Props) => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const validationSchema = yup
    .object()
    .shape({
      annotation: yup.string().max(4000).defined(),
    })
    .defined();

  const transform = useCallback(
    () =>
      pipe(
        mapPayload(({ annotation: annotationMessage }) => {
          return {
            colonyName: name,
            colonyAddress,
            walletAddress: user?.walletAddress,
            annotationMessage,
          };
        }),
        withMeta({ navigate }),
      ),
    [navigate, name, user, colonyAddress],
  );

  return (
    <Form<FormValues>
      defaultValues={{
        annotation: '',
      }}
      submit={ActionTypes.ACTION_RECOVERY}
      error={ActionTypes.ACTION_RECOVERY_ERROR}
      success={ActionTypes.ACTION_RECOVERY_SUCCESS}
      validationSchema={validationSchema}
      onSuccess={close}
      transform={transform}
    >
      {({ formState }) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formState}
            colony={colony}
            back={() => callStep(prevStep)}
          />
        </Dialog>
      )}
    </Form>
  );
};

RecoveryModeDialog.displayName = displayName;

export default RecoveryModeDialog;
