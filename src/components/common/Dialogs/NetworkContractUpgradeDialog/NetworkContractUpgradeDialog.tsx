import React, { useState } from 'react';
import { string, object, boolean, InferType } from 'yup';
import { useNavigate } from 'react-router-dom';

import { pipe, withMeta, mapPayload } from '~utils/actions';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';

import DialogForm from './NetworkContractUpgradeDialogForm';
import { getNetworkContractUpgradeDialogPayload } from './helpers';

type Props = DialogProps & Partial<WizardDialogType<object>> & ActionDialogProps;

const displayName = 'common.NetworkContractUpgradeDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    annotation: string().max(4000).defined(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const NetworkContractUpgradeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  enabledExtensionData: { isVotingReputationEnabled },
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const actionType =
    isVotingReputationEnabled && !isForce ? ActionTypes.ROOT_MOTION : ActionTypes.ACTION_VERSION_UPGRADE;

  const transform = pipe(
    mapPayload((payload) => getNetworkContractUpgradeDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          annotation: '',
          /*
           * @NOTE That since this a root motion, and we don't actually make use
           * of the motion domain selected (it's disabled), we don't need to actually
           * pass the value over to the motion, since it will always be 1
           */
        }}
        actionType={actionType}
        validationSchema={validationSchema}
        transform={transform}
        onSuccess={close}
      >
        {({ getValues }) => {
          const values = getValues();
          if (values.forceAction !== isForce) {
            setIsForce(values.forceAction);
          }
          return (
            <DialogForm
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              enabledExtensionData={enabledExtensionData}
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

NetworkContractUpgradeDialog.displayName = displayName;

export default NetworkContractUpgradeDialog;
