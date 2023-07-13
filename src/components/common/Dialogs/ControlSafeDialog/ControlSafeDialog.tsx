import React from 'react';
import { InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks';
import { Safe } from '~types';
import { SUPPORTED_SAFE_NETWORKS } from '~constants';

import ControlSafeForm from './ControlSafeForm';
import { getValidationSchema } from './validation';

interface CustomWizardDialogProps extends ActionDialogProps {
  preselectedSafe?: Safe;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  CustomWizardDialogProps;

export const displayName = 'common.ControlSafeDialog';

const ControlSafeDialog = ({
  colony,
  enabledExtensionData,
  preselectedSafe,
  prevStep,
  callStep,
  cancel,
  close,
}: Props) => {
  const validationSchema = getValidationSchema();

  type FormValues = InferType<typeof validationSchema>;

  const preselectedSafeChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === Number(preselectedSafe?.chainId || '0'),
  );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          safe: preselectedSafe
            ? {
                id: preselectedSafe.moduleContractAddress,
                walletAddress: preselectedSafe.address,
                profile: {
                  displayName: `${preselectedSafe.name} (${preselectedSafeChain?.name})`,
                },
              }
            : undefined,
        }}
        validationSchema={validationSchema}
        actionType={ActionTypes.ACTION_MANAGE_EXISTING_SAFES}
        /* transform={transform} */
        onSuccess={close}
      >
        <ControlSafeForm
          back={() => callStep(prevStep)}
          colony={colony}
          enabledExtensionData={enabledExtensionData}
        />
      </Form>
    </Dialog>
  );
};

ControlSafeDialog.displayName = displayName;

export default ControlSafeDialog;
