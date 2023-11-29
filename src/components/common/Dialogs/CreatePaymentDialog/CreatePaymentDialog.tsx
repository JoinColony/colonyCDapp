import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { getVerifiedUsers } from '~utils/verifiedUsers';
import { WizardDialogType, useNetworkInverseFee } from '~hooks';
import { useMemberContext } from '~context/MemberContext';

import DialogForm from './CreatePaymentDialogForm';
import { getCreatePaymentDialogPayload } from './helpers';
import getValidationSchema from './validation';

const displayName = 'common.CreatePaymentDialog';

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    filteredDomainId?: number;
  };

type FormValues = InferType<ReturnType<typeof getValidationSchema>>;

const CreatePaymentDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  filteredDomainId,
  colony,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  const { members: allColonyMembers } = useMemberContext();

  const { isVotingReputationEnabled } = enabledExtensionData;
  const { networkInverseFee } = useNetworkInverseFee();

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_EXPENDITURE_PAYMENT
      : ActionTypes.ACTION_EXPENDITURE_PAYMENT;

  const validationSchema = getValidationSchema(colony, networkInverseFee);

  const isWhitelistActivated = colony.metadata?.isWhitelistActivated;

  const verifiedUsers = getVerifiedUsers(
    colony.metadata?.whitelistedAddresses ?? [],
    allColonyMembers,
  );

  const transform = pipe(
    mapPayload((payload) => {
      return getCreatePaymentDialogPayload(colony, payload, networkInverseFee);
    }),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
        defaultValues={{
          forceAction: false,
          fromDomainId: filteredDomainId || Id.RootDomain,
          payments: [
            {
              recipient: undefined,
              amount: 0,
              tokenAddress: colony?.nativeToken.tokenAddress,
            },
          ],
          annotation: '',
          motionDomainId: filteredDomainId || Id.RootDomain,
        }}
        validationSchema={validationSchema}
        actionType={actionType}
        transform={transform}
        onSuccess={close}
      >
        <DialogForm
          back={() => callStep(prevStep)}
          verifiedUsers={
            isWhitelistActivated ? verifiedUsers : allColonyMembers
          }
          colony={colony}
          enabledExtensionData={enabledExtensionData}
          handleIsForceChange={setIsForce}
          isForce={isForce}
        />
      </ActionForm>
    </Dialog>
  );
};

CreatePaymentDialog.displayName = displayName;

export default CreatePaymentDialog;
