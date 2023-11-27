import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { GNOSIS_AMB_BRIDGES, SAFE_NAMES_MAP } from '~constants';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~hooks';

import AddExistingSafeDialogForm from './AddExistingSafeDialogForm';
import { getValidationSchema } from './validation';
import { getAddExistingSafeDialogPayload } from './helpers';
import { NetworkOption } from './types';

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps;

export const displayName = 'common.AddExistingSafeDialog';

const AddExistingSafeDialog = ({
  colony: { colonyAddress, metadata },
  colony,
  callStep,
  prevStep,
  cancel,
  close,
}: Props) => {
  const navigate = useNavigate();
  const loadingModuleState = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(1);
  const abortControllerState = useState<AbortController | undefined>(undefined);

  const validationSchema = getValidationSchema(
    stepIndex,
    abortControllerState,
    metadata?.safes || [],
    loadingModuleState,
  );

  type FormValues = InferType<typeof validationSchema>;

  // Create array for Network options
  const networkOptions: NetworkOption[] = Object.keys(GNOSIS_AMB_BRIDGES).map(
    (chainId) => {
      return {
        label: SAFE_NAMES_MAP[chainId],
        value: Number(chainId),
      };
    },
  );

  const transform = pipe(
    mapPayload((payload) => getAddExistingSafeDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
        defaultValues={{
          chainId: networkOptions[0].value,
          safeName: '',
          contractAddress: '',
        }}
        validationSchema={validationSchema}
        actionType={ActionTypes.ACTION_MANAGE_EXISTING_SAFES}
        transform={transform}
        onSuccess={close}
      >
        <AddExistingSafeDialogForm
          networkOptions={networkOptions}
          back={() => callStep(prevStep)}
          colonyAddress={colonyAddress}
          loadingModuleState={loadingModuleState}
          stepIndex={stepIndex}
          setStepIndex={setStepIndex}
        />
      </ActionForm>
    </Dialog>
  );
};

AddExistingSafeDialog.displayName = displayName;

export default AddExistingSafeDialog;
