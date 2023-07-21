import React, { useState, useEffect } from 'react';
import { InferType } from 'yup';
import { useNavigate } from 'react-router-dom';

import { pipe, withMeta, mapPayload } from '~utils/actions';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import { Safe } from '~types';
import { SUPPORTED_SAFE_NETWORKS } from '~constants';
import { AbiItemExtended } from '~utils/safes';

import ControlSafeForm from './ControlSafeForm';
import { getMethodInputValidation, getValidationSchema } from './validation';
import { defaultTransaction, getManageSafeDialogPayload } from './helpers';

interface CustomWizardDialogProps extends ActionDialogProps {
  preselectedSafe?: Safe;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  CustomWizardDialogProps;

export type UpdatedMethods = {
  [key: number]: AbiItemExtended | undefined;
};

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
  const [selectedContractMethods, setSelectedContractMethods] =
    useState<UpdatedMethods>();
  const [expandedValidationSchema, setExpandedValidationSchema] = useState<
    Record<string, any>
  >({});

  const navigate = useNavigate();

  const validationSchema = getValidationSchema(expandedValidationSchema);

  type FormValues = InferType<typeof validationSchema>;

  const preselectedSafeChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === preselectedSafe?.chainId || 0,
  );

  const transform = pipe(
    mapPayload((payload) => getManageSafeDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  useEffect(() => {
    if (selectedContractMethods) {
      const updatedExpandedValidationSchema = {};

      Object.values(selectedContractMethods).forEach((method) => {
        method?.inputs?.forEach((input) => {
          const inputName = `${input.name}-${method.name}`;
          if (!updatedExpandedValidationSchema[inputName]) {
            updatedExpandedValidationSchema[inputName] =
              getMethodInputValidation(input?.type || '', method.name);
          }
        });
      });

      setExpandedValidationSchema(updatedExpandedValidationSchema);
    }
  }, [selectedContractMethods]);

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
          transactions: [defaultTransaction],
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
          selectedContractMethods={selectedContractMethods}
          setSelectedContractMethods={setSelectedContractMethods}
        />
      </Form>
    </Dialog>
  );
};

ControlSafeDialog.displayName = displayName;

export default ControlSafeDialog;
