import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
// import {
//   useColonyFromNameQuery,
//   useMembersSubscription,
//   useNetworkContracts,
// } from '~data/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
// import { getVerifiedUsers } from '~utils/verifiedRecipients';
import { WizardDialogType } from '~hooks';
import { notNull } from '~utils/arrays';

import validationSchema from './validation';
import DialogForm from './CreatePaymentDialogForm';
import { getCreatePaymentDialogPayload } from './helpers';

const displayName = 'common.CreatePaymentDialog';

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    filteredDomainId?: number;
  };

export type FormValues = InferType<typeof validationSchema>;

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
  const colonyWatchers =
    colony?.watchers?.items.filter(notNull).map((item) => item.user) || [];
  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_EXPENDITURE_PAYMENT
      : ActionTypes.ACTION_EXPENDITURE_PAYMENT;

  // const { data: colonyMembers } = useMembersSubscription({
  //   variables: { colonyAddress },
  // });

  // const { feeInverse: networkFeeInverse } = useNetworkContracts();

  /*
   * @NOTE This (extravagant) query retrieves the latest whitelist data.
   * Whitelist data from colony prop can be stale.
   *
   * Add/remove to whitelist then navigating to payment dialog
   * without closing the modal will cause the whitelist data in
   * colony prop to be outdated.
   */
  // const { data: colonyData } = useColonyFromNameQuery({
  //   variables: { name: colonyName, address: colonyAddress },
  // });
  // const isWhitelistActivated =
  //   colonyData?.processedColony?.isWhitelistActivated;

  // const verifiedUsers = useMemo(() => {
  //   return getVerifiedUsers(colony.whitelistedAddresses, subscribedUsers) || [];
  // }, [subscribedUsers, colony]);

  // const showWarningForAddress = (walletAddress) => {
  //   if (!walletAddress) return false;
  //   return isWhitelistActivated
  //     ? !colonyData?.processedColony?.whitelistedAddresses.some(
  //         (el) => el.toLowerCase() === walletAddress.toLowerCase(),
  //       )
  //     : false;
  // };

  const transform = pipe(
    mapPayload((payload) => getCreatePaymentDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        fromDomain: filteredDomainId ?? Id.RootDomain,
        recipient: undefined,
        amount: '',
        tokenAddress: colony?.nativeToken.tokenAddress,
        annotation: '',
        motionDomainId: filteredDomainId ?? Id.RootDomain,
      }}
      validationSchema={validationSchema}
      actionType={actionType}
      transform={transform}
      onSuccess={close}
    >
      {({ getValues }) => {
        const forceActionvalue = getValues('forceAction');
        if (forceActionvalue !== isForce) {
          setIsForce(forceActionvalue);
        }

        return (
          <Dialog cancel={cancel}>
            <DialogForm
              back={() => callStep(prevStep)}
              verifiedUsers={
                colonyWatchers // isWhitelistActivated ? verifiedUsers : ...
              }
              // showWhitelistWarning={showWarningForAddress(
              //   values?.recipient?.walletAddress,
              // )}
              colony={colony}
              enabledExtensionData={enabledExtensionData}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

CreatePaymentDialog.displayName = displayName;

export default CreatePaymentDialog;
