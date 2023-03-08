import React, { useState } from 'react';
import { string, object, number, boolean, InferType } from 'yup';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Dialog from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { useEnabledExtensions } from '~hooks'; // useSelectedUser
// import { getVerifiedUsers } from '~utils/verifiedRecipients';
import { notNull } from '~utils/arrays';

import DialogForm from '../ManageReputationDialogForm';
import { AwardAndSmiteDialogProps } from '../types';

import { getManageReputationDialogPayload } from './helpers';

const displayName = 'common.ManageReputationContainer';

const MSG = defineMessages({
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
});

const defaultValidationSchema = object()
  .shape({
    domainId: number().required(),
    user: object().shape({
      walletAddress: string().address().required(),
    }),
    amount: number()
      .required()
      .moreThan(0, () => MSG.amountZero),
    annotation: string().max(4000),
    forceAction: boolean(),
    motionDomainId: number(),
  })
  .defined();

type FormValues = InferType<typeof defaultValidationSchema>;

const ManageReputationContainer = ({
  colony: { nativeToken, watchers },
  colony,
  callStep,
  prevStep,
  cancel,
  close,
  filteredDomainId,
  isSmiteAction = false,
}: AwardAndSmiteDialogProps) => {
  const [isForce, setIsForce] = useState(false);
  const [userReputation, setUserReputation] = useState(0);
  const navigate = useNavigate();

  const colonyWatchers =
    watchers?.items.filter(notNull).map((item) => item.user) || [];

  // const verifiedUsers = useMemo(() => {
  //   return getVerifiedUsers(colony.whitelistedAddresses, colonyWatchers) || [];
  // }, [colonyWatchers, colony]);

  const updateReputationCallback = (userRepPercentage: number) => {
    setUserReputation(userRepPercentage);
  };

  const {
    enabledExtensions: { isVotingReputationEnabled },
  } = useEnabledExtensions();

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_MANAGE_REPUTATION
      : ActionTypes.ACTION_MANAGE_REPUTATION;

  let smiteValidationSchema;

  if (isSmiteAction) {
    const amountValidationSchema = object()
      .shape({ amount: number().max(userReputation) })
      .required();
    smiteValidationSchema = defaultValidationSchema.concat(
      amountValidationSchema,
    );
  }

  const nativeTokenDecimals = nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS;

  const transform = pipe(
    mapPayload((payload) =>
      getManageReputationDialogPayload(
        colony,
        isSmiteAction,
        nativeTokenDecimals,
        payload,
      ),
    ),
    withMeta({ navigate }),
  );

  // const { isWhitelistActivated } = colony;
  // const selectedUser = useSelectedUser(
  //   isWhitelistActivated ? verifiedUsers : colonyWatchers,
  // );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        domainId: filteredDomainId ?? Id.RootDomain,
        // user: selectedUser,
        motionDomainId: Id.RootDomain,
        amount: 0,
        annotation: '',
      }}
      actionType={actionType}
      validationSchema={smiteValidationSchema || defaultValidationSchema}
      onSuccess={close}
      transform={transform}
    >
      {({ getValues }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              colony={colony}
              nativeTokenDecimals={nativeTokenDecimals}
              back={() => callStep(prevStep)}
              verifiedUsers={
                colonyWatchers // isWhitelistActivated ? verifiedUsers : colonyWatchers
              }
              updateReputation={
                isSmiteAction ? updateReputationCallback : undefined
              }
              isSmiteAction={isSmiteAction}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

ManageReputationContainer.displayName = displayName;

export default ManageReputationContainer;
