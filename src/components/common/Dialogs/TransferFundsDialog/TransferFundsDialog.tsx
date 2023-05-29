import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Id } from '@colony/colony-js';
import { InferType } from 'yup';

import { getDomainOptions } from '~utils/domains';
import { notNull } from '~utils/arrays';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { WizardDialogType } from '~hooks';

import TransferFundsDialogForm from './TransferFundsDialogForm';
import { getTransferFundsDialogPayload } from './helpers';
import { getValidationSchema } from './validation';

export const displayName = 'common.TransferFundsDialog';

type FormValues = InferType<ReturnType<typeof getValidationSchema>>;

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    filteredDomainId?: number;
  };

const TransferFundsDialog = ({
  colony,
  filteredDomainId: selectedDomainId,
  callStep,
  prevStep,
  cancel,
  close,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled ? ActionTypes.MOTION_MOVE_FUNDS : ActionTypes.ACTION_MOVE_FUNDS;

  const colonyDomains = colony?.domains?.items.filter(notNull) || [];
  const domainOptions = getDomainOptions(colonyDomains);

  const transform = pipe(
    mapPayload((payload) => getTransferFundsDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  const defaultFromDomainId = selectedDomainId || Id.RootDomain;
  const defaultToDomainId =
    Number(domainOptions.find((option) => option.value !== defaultFromDomainId)?.value) || Id.RootDomain;

  const validationSchema = getValidationSchema(colony);

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          fromDomainId: defaultFromDomainId,
          toDomainId: defaultToDomainId,
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress,
          annotation: '',
          /*
           * @NOTE That since this a root motion, and we don't actually make use
           * of the motion domain selected (it's disabled), we don't need to actually
           * pass the value over to the motion, since it will always be 1
           */
        }}
        validationSchema={validationSchema}
        actionType={actionType}
        onSuccess={close}
        transform={transform}
      >
        {({ watch }) => {
          const forceActionValue = watch('forceAction');
          if (forceActionValue !== isForce) {
            setIsForce(forceActionValue);
          }
          return (
            <TransferFundsDialogForm
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

TransferFundsDialog.displayName = displayName;

export default TransferFundsDialog;
