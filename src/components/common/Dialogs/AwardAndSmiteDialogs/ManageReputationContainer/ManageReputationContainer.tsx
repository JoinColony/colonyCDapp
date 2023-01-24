import React, { useCallback, useMemo, useState } from 'react';
import { string, object, number, boolean } from 'yup';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import Decimal from 'decimal.js';
import { defineMessages } from 'react-intl';

import Dialog from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { ActionTypes } from '~redux/index';
// import { useMembersSubscription } from '~data/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
// import { useSelectedUser } from '~hooks';
// import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
// import { getVerifiedUsers } from '~utils/verifiedRecipients';
import { notNull } from '~utils/arrays';

import DialogForm from '../ManageReputationDialogForm';
import {
  AwardAndSmiteDialogProps,
  ManageReputationDialogFormValues,
} from '../types';

const displayName = 'common.ManageReputationContainer';

const MSG = defineMessages({
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
});

const ManageReputationContainer = ({
  colony: { colonyAddress, name, nativeToken, watchers }, // tokens
  colony,
  callStep,
  prevStep,
  cancel,
  close,
  ethDomainId,
  isSmiteAction = false,
}: AwardAndSmiteDialogProps) => {
  const [isForce, setIsForce] = useState(false);
  const [userReputation, setUserReputation] = useState(0);
  const navigate = useNavigate();

  // const { data: colonyMembers } = useMembersSubscription({
  //   variables: { colonyAddress },
  // });

  const colonyWatchers = useMemo(
    () => watchers?.items.filter(notNull).map((item) => item.user) || [],
    [watchers],
  );

  // const verifiedUsers = useMemo(() => {
  //   return getVerifiedUsers(colony.whitelistedAddresses, colonyWatchers) || [];
  // }, [colonyWatchers, colony]);

  const updateReputationCallback = (userRepPercentage: number) => {
    setUserReputation(userRepPercentage);
  };

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce // && isVotingExtensionEnabled
        ? ActionTypes[`MOTION_MANAGE_REPUTATION${actionEnd}`]
        : ActionTypes[`ACTION_MANAGE_REPUTATION${actionEnd}`];
    },
    [isForce], // , isVotingExtensionEnabled
  );

  const defaultValidationSchema = object().shape({
    domainId: number().required(),
    user: object().shape({
      profile: object().shape({
        walletAddress: string().address().required(),
      }),
    }),
    amount: number()
      .required()
      .moreThan(0, () => MSG.amountZero),
    annotation: string().max(4000),
    forceAction: boolean(),
    motionDomainId: number(),
  });
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

  const transform = useCallback(
    () =>
      pipe(
        mapPayload(({ amount, domainId, annotation, user, motionDomainId }) => {
          const reputationChangeAmount = new Decimal(amount)
            .mul(new Decimal(10).pow(nativeTokenDecimals))
            // Smite amount needs to be negative, otherwise leave it as it is
            .mul(isSmiteAction ? -1 : 1);

          return {
            colonyAddress,
            colonyName: name,
            domainId,
            userAddress: user.profile.walletAddress,
            annotationMessage: annotation,
            amount: reputationChangeAmount.toString(),
            motionDomainId,
            isSmitingReputation: isSmiteAction,
          };
        }),
        withMeta({ navigate }),
      ),
    [isSmiteAction, colonyAddress, name, nativeTokenDecimals, navigate],
  );

  // const { isWhitelistActivated } = colony;
  // const selectedUser = useSelectedUser(
  //   isWhitelistActivated ? verifiedUsers : colonyWatchers,
  // );

  return (
    <Form<ManageReputationDialogFormValues>
      defaultValues={{
        forceAction: false,
        domainId: (ethDomainId === 0 || ethDomainId === undefined
          ? Id.RootDomain
          : ethDomainId
        ).toString(),
        // user: selectedUser,
        motionDomainId: Id.RootDomain,
        amount: 0,
        annotation: '',
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={smiteValidationSchema || defaultValidationSchema}
      onSuccess={close}
      transform={transform}
    >
      {({ formState, getValues, setValue }) => {
        const values = getValues();
        if (values.forceAction !== isForce) {
          setIsForce(values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formState}
              values={values}
              setValue={setValue}
              colony={colony}
              nativeTokenDecimals={nativeTokenDecimals}
              back={() => callStep(prevStep)}
              ethDomainId={ethDomainId}
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
