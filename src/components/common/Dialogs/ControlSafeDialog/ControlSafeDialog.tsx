import React, { useState, useEffect } from 'react';
import { InferType } from 'yup';
import { useNavigate } from 'react-router-dom';
import { Id } from '@colony/colony-js';

import { pipe, withMeta, mapPayload } from '~utils/actions';
import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import { Safe } from '~types';
import { SUPPORTED_SAFE_NETWORKS } from '~constants';
import { defaultTransaction } from '~utils/safes';

import ControlSafeForm from './ControlSafeForm';
import { getMethodInputValidation, getValidationSchema } from './validation';
import { getControlSafeDialogPayload } from './helpers';
import { UpdatedMethods } from './types';

interface CustomWizardDialogProps extends ActionDialogProps {
  preselectedSafe?: Safe;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'common.ControlSafeDialog';

const ControlSafeDialog = ({
  colony,
  enabledExtensionData,
  preselectedSafe,
  prevStep,
  callStep,
  cancel,
  close,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const [selectedContractMethods, setSelectedContractMethods] =
    useState<UpdatedMethods>();
  const [expandedValidationSchema, setExpandedValidationSchema] = useState<
    Record<string, any>
  >({});
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION
      : ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION;

  const validationSchema = getValidationSchema(
    showPreview,
    expandedValidationSchema,
  );

  type FormValues = InferType<typeof validationSchema>;

  const preselectedSafeChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === preselectedSafe?.chainId || 0,
  );

  const transform = pipe(
    mapPayload((payload) => getControlSafeDialogPayload(colony, payload)),
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
      <ActionForm<FormValues>
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
          motionDomainId: Id.RootDomain,
        }}
        validationSchema={validationSchema}
        actionType={actionType}
        transform={transform}
        onSuccess={close}
      >
        <ControlSafeForm
          back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          colony={colony}
          enabledExtensionData={enabledExtensionData}
          selectedContractMethods={selectedContractMethods}
          setSelectedContractMethods={setSelectedContractMethods}
          showPreview={showPreview}
          handleShowPreviewChange={setShowPreview}
          handleIsForceChange={setIsForce}
          isForce={isForce}
        />
      </ActionForm>
    </Dialog>
  );
};

ControlSafeDialog.displayName = displayName;

export default ControlSafeDialog;
