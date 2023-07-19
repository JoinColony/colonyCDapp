import React from 'react';
import { InferType } from 'yup';
import { useNavigate } from 'react-router-dom';

import { pipe, withMeta, mapPayload } from '~utils/actions';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import { Safe } from '~types';
import { SUPPORTED_SAFE_NETWORKS } from '~constants';

import ControlSafeForm from './ControlSafeForm';
import { getValidationSchema } from './validation';
import { getManageSafeDialogPayload } from './helpers';

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
  const navigate = useNavigate();

  const validationSchema = getValidationSchema();

  type FormValues = InferType<typeof validationSchema>;

  const preselectedSafeChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === Number(preselectedSafe?.chainId || '0'),
  );

  const transform = pipe(
    mapPayload((payload) => getManageSafeDialogPayload(colony, payload)),
    withMeta({ navigate }),
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
        transform={transform}
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
