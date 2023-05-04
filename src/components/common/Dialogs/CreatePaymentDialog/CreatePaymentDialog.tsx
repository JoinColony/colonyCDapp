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
import { WizardDialogType, useNetworkInverseFee } from '~hooks';
import { useGetMembersForColonyQuery } from '~gql';

import DialogForm from './CreatePaymentDialogForm';
import { extractUsersFromColonyMemberData, getCreatePaymentDialogPayload } from './helpers';
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

  const { data } = useGetMembersForColonyQuery({
    skip: !colony.colonyAddress,
    variables: {
      input: {
        colonyAddress: colony.colonyAddress,
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const colonyContributors = extractUsersFromColonyMemberData(data?.getMembersForColony?.contributors);
  const colonyWatchers = extractUsersFromColonyMemberData(data?.getMembersForColony?.watchers);
  const colonyMembers = colonyContributors.concat(colonyWatchers);

  const { isVotingReputationEnabled } = enabledExtensionData;
  const { networkInverseFee } = useNetworkInverseFee();

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_EXPENDITURE_PAYMENT
      : ActionTypes.ACTION_EXPENDITURE_PAYMENT;

  const validationSchema = getValidationSchema(colony, networkInverseFee);

  // const { data: colonyMembers } = useMembersSubscription({
  //   variables: { colonyAddress },
  // });

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
    mapPayload((payload) => getCreatePaymentDialogPayload(colony, payload, networkInverseFee)),
    withMeta({ navigate }),
  );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          fromDomainId: filteredDomainId || Id.RootDomain,
          recipient: undefined,
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress,
          annotation: '',
          motionDomainId: filteredDomainId || Id.RootDomain,
        }}
        validationSchema={validationSchema}
        actionType={actionType}
        transform={transform}
        onSuccess={close}
      >
        {({ watch }) => {
          const forceActionvalue = watch('forceAction');
          if (forceActionvalue !== isForce) {
            setIsForce(forceActionvalue);
          }

          return (
            <DialogForm
              back={() => callStep(prevStep)}
              verifiedUsers={
                colonyMembers // isWhitelistActivated ? verifiedUsers : ...
              }
              // showWhitelistWarning={showWarningForAddress(
              //   values?.recipient?.walletAddress,
              // )}
              colony={colony}
              enabledExtensionData={enabledExtensionData}
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

CreatePaymentDialog.displayName = displayName;

export default CreatePaymentDialog;
