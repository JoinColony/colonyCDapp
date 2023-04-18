import React from 'react';
import { object, string, InferType } from 'yup';
import { useNavigate } from 'react-router-dom';

import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux';
import { useAppContext, WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import { getRecoveryModeDialogPayload } from './helpers';
import DialogForm from './RecoveryModeDialogForm';

type Props = Required<DialogProps> & WizardDialogType<object> & ActionDialogProps;

const displayName = 'common.RecoveryModeDialog';

const validationSchema = object()
  .shape({
    annotation: string().max(4000).defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const RecoveryModeDialog = ({ cancel, close, callStep, prevStep, colony }: Props) => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload((payload) => getRecoveryModeDialogPayload(colony, payload, user)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          annotation: '',
        }}
        actionType={ActionTypes.ACTION_RECOVERY}
        validationSchema={validationSchema}
        onSuccess={close}
        transform={transform}
      >
        {({ formState }) => (
          <DialogForm
            {...formState}
            colony={colony}
            back={() => callStep(prevStep)}
          />
        )}
      </Form>
    </Dialog>
  );
};

RecoveryModeDialog.displayName = displayName;

export default RecoveryModeDialog;
