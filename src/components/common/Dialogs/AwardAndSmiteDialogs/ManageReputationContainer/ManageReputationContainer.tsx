import React, { useState } from 'react';
import { string, object, number, boolean, InferType } from 'yup';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Decimal from 'decimal.js';
import { extractUsersFromColonyMemberData } from '~utils/members';
import Dialog from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
// import { useSelectedUser } from '~hooks';
// import { getVerifiedUsers } from '~utils/verifiedRecipients';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useGetMembersForColonyQuery } from '~gql';

import DialogForm from '../ManageReputationDialogForm';
import { AwardAndSmiteDialogProps } from '../types';

import { getManageReputationDialogPayload } from './helpers';

const displayName = 'common.ManageReputationContainer';

const MSG = defineMessages({
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
  maxAmount: {
    id: `${displayName}.maxAmount`,
    defaultMessage: "Amount must be less than the user's reputation",
  },
});

const defaultValidationSchema = object()
  .shape({
    domainId: number().required(),
    user: object().shape({
      walletAddress: string().address().required(),
    }),
    amount: string()
      .required()
      .test(
        'more-than-zero',
        () => MSG.amountZero,
        (value) => {
          const numberWithoutCommas = (value || '0').replace(/,/g, ''); // @TODO: Remove this once the fix for FormattedInputComponent value is introduced.
          return !new Decimal(numberWithoutCommas).isZero();
        },
      ),
    annotation: string().max(4000),
    forceAction: boolean(),
    motionDomainId: number(),
  })
  .defined();

type FormValues = InferType<typeof defaultValidationSchema>;

const ManageReputationContainer = ({
  colony: { nativeToken },
  colony,
  callStep,
  prevStep,
  cancel,
  close,
  filteredDomainId,
  isSmiteAction = false,
  enabledExtensionData,
}: AwardAndSmiteDialogProps) => {
  const [isForce, setIsForce] = useState(false);
  const [schemaUserReputation, setSchemaUserReputation] = useState(0);
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
  const colonyContributors = extractUsersFromColonyMemberData(
    data?.getMembersForColony?.contributors,
  );
  const colonyWatchers = extractUsersFromColonyMemberData(
    data?.getMembersForColony?.watchers,
  );
  const colonyMembers = colonyContributors.concat(colonyWatchers);

  // const verifiedUsers = useMemo(() => {
  //   return getVerifiedUsers(colony.whitelistedAddresses, colonyMembers) || [];
  // }, [colonyMembers, colony]);

  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_MANAGE_REPUTATION
      : ActionTypes.ACTION_MANAGE_REPUTATION;

  let smiteValidationSchema;

  if (isSmiteAction) {
    const amountValidationSchema = object()
      .shape({
        amount: string()
          .required()
          .test(
            'more-than-zero',
            () => MSG.amountZero,
            (value) => {
              const numberWithoutCommas = (value || '0').replace(/,/g, ''); // @TODO: Remove this once the fix for FormattedInputComponent value is introduced.
              return !new Decimal(numberWithoutCommas).isZero();
            },
          )
          .test(
            'less-than-user-reputation',
            () => MSG.maxAmount,
            (value) => {
              const numberWithoutCommas = (value || '0').replace(/,/g, ''); // @TODO: Remove this once the fix for FormattedInputComponent value is introduced.
              return !new Decimal(numberWithoutCommas).greaterThan(
                schemaUserReputation,
              );
            },
          ),
      })
      .required();
    smiteValidationSchema = defaultValidationSchema.concat(
      amountValidationSchema,
    );
  }

  const nativeTokenDecimals = getTokenDecimalsWithFallback(
    nativeToken?.decimals,
  );

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
  //   isWhitelistActivated ? verifiedUsers : colonyMembers,
  // );

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          domainId: filteredDomainId || Id.RootDomain,
          // user: selectedUser,
          motionDomainId: Id.RootDomain,
          amount: '',
          annotation: '',
        }}
        actionType={actionType}
        validationSchema={smiteValidationSchema || defaultValidationSchema}
        onSuccess={close}
        transform={transform}
      >
        {({ watch }) => {
          const forceAction = watch('forceAction');
          if (forceAction !== isForce) {
            setIsForce(forceAction);
          }

          return (
            <DialogForm
              colony={colony}
              nativeTokenDecimals={nativeTokenDecimals}
              back={() => callStep(prevStep)}
              verifiedUsers={
                colonyMembers // isWhitelistActivated ? verifiedUsers : colonyMembers
              }
              updateSchemaUserReputation={
                isSmiteAction ? setSchemaUserReputation : undefined
              }
              schemaUserReputation={schemaUserReputation}
              isSmiteAction={isSmiteAction}
              enabledExtensionData={enabledExtensionData}
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

ManageReputationContainer.displayName = displayName;

export default ManageReputationContainer;
