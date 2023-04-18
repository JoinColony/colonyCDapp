import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, boolean, InferType } from 'yup';
import { defineMessages } from 'react-intl';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import EditColonyDetailsDialogForm from './EditColonyDetailsDialogForm';
import { getEditColonyDetailsDialogPayload } from './helpers';

type Props = Required<DialogProps> & WizardDialogType<object> & ActionDialogProps;

const displayName = 'common.EditColonyDetailsDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
});

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    colonyAvatarImage: string().nullable().defined(),
    colonyDisplayName: string().required(() => MSG.requiredFieldError),
    annotationMessage: string().max(4000).defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const EditColonyDetailsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony: { metadata },
  colony,
  enabledExtensionData: { isVotingReputationEnabled },
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const actionType =
    !isForce && isVotingReputationEnabled ? ActionTypes.MOTION_EDIT_COLONY : ActionTypes.ACTION_EDIT_COLONY;

  const transform = pipe(
    mapPayload((payload) => getEditColonyDetailsDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        colonyDisplayName: metadata?.displayName,
        colonyAvatarImage: metadata?.avatar,
        annotationMessage: '',
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      actionType={actionType}
      validationSchema={validationSchema}
      onSuccess={close}
      transform={transform}
    >
      {({ getValues }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <EditColonyDetailsDialogForm
              colony={colony}
              back={() => callStep(prevStep)}
              enabledExtensionData={enabledExtensionData}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

EditColonyDetailsDialog.displayName = displayName;

export default EditColonyDetailsDialog;
