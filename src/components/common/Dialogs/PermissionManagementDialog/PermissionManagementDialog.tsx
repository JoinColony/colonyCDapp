import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { string, object, array, number, boolean, InferType } from 'yup';

import {
  mergePayload,
  withKey,
  mapPayload,
  pipe,
  withMeta,
} from '~utils/actions';
import { ActionTypes } from '~redux';
import { WizardDialogType, useAppContext } from '~hooks';
import { useGetMembersForColonyQuery } from '~gql';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import PermissionManagementForm from './PermissionManagementForm';

const validationSchema = object()
  .shape({
    domainId: number().required(),
    user: object()
      .shape({
        profile: object()
          .shape({
            displayName: string(),
          })
          .defined()
          .nullable(),
        walletAddress: string().address().required(),
      })
      .defined()
      .nullable(),
    roles: array().ensure().of(string()).defined(),
    annotation: string().max(4000).defined(),
    forceAction: boolean(),
    motionDomainId: number(),
  })
  .defined();

const displayName = 'common.PermissionManagementDialog';

type FormValues = InferType<typeof validationSchema>;

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps & {
    ethDomainId?: number;
  };

const PermissionManagementDialog = ({
  colony: { colonyAddress, name },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  ethDomainId: preselectedDomainId,
  enabledExtensionData,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();
  const { isVotingReputationEnabled } = enabledExtensionData;
  const { user: currentUser } = useAppContext();

  const actionType =
    !isForce && isVotingReputationEnabled
      ? ActionTypes.MOTION_USER_ROLES_SET
      : ActionTypes.ACTION_USER_ROLES_SET;

  const transform = pipe(
    withKey(colonyAddress),
    mapPayload((payload) => getPermissionManagementDialogPayload(payload)),
    mergePayload({
      colonyAddress,
      colonyName: name,
    }),
    withMeta({ navigate }),
  );

  const defaultDomain = !preselectedDomainId
    ? Id.RootDomain
    : preselectedDomainId;

  const { data, loading: loadingMembers } = useGetMembersForColonyQuery({
    skip: !colony?.colonyAddress,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  /*
   * @TODO This also needs a list of all users that have, or had permissions within
   * this colony even though they don't have an account created (or are a colony,
   * extension, token, or a random address)
   */
  const users = [
    ...data?.getMembersForColony?.contributors,
    ...data?.getMembersForColony?.watchers,
  ].map(({ user }) => ({
    ...user,
    // Needed to satisly Omnipicker's key
    id: user.walletAddress,
  }));

  const defaultUser =
    users.find((user) => user?.walletAddress === currentUser?.walletAddress) ||
    users[0];

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          user: defaultUser,
          domainId: defaultDomain,
          roles: [],
          annotation: '',
          motionDomainId: defaultDomain,
        }}
        validationSchema={validationSchema}
        onSuccess={close}
        actionType={actionType}
        transform={transform}
      >
        {({ watch }) => {
          const forceAction = watch('forceAction');
          if (forceAction !== isForce) {
            setIsForce(forceAction);
          }

          return (
            <PermissionManagementForm
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              close={close}
              enabledExtensionData={enabledExtensionData}
              users={users}
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

PermissionManagementDialog.displayName = displayName;

export default PermissionManagementDialog;
