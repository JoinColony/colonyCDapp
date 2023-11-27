import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { string, object, array, number, boolean, InferType } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
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
import { ActionForm } from '~shared/Fields';

import PermissionManagementForm from './PermissionManagementForm';
import { getPermissionManagementDialogPayload } from './helpers';

const validationSchema = object()
  .shape({
    domainId: number().required(),
    user: object()
      .shape({
        profile: object()
          .shape({
            displayName: string().nullable(),
          })
          .defined()
          .nullable(),
        walletAddress: string().address().required(),
      })
      .defined(),
    roles: array().ensure().of(string()).defined(),
    annotation: string().max(MAX_ANNOTATION_LENGTH).defined(),
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

  const { data } = useGetMembersForColonyQuery({
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
    ...(data?.getMembersForColony?.contributors || []),
    ...(data?.getMembersForColony?.watchers || []),
  ].map(({ user }) => ({
    walletAddress: '',
    name: '',
    ...user,
    // Needed to satisfy Omnipicker's key
    id: user?.walletAddress,
  }));

  const defaultUser =
    users.find((user) => user?.walletAddress === currentUser?.walletAddress) ||
    users[0];

  return (
    <Dialog cancel={cancel}>
      <ActionForm<FormValues>
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
        <PermissionManagementForm
          colony={colony}
          back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          enabledExtensionData={enabledExtensionData}
          users={users}
          handleIsForceChange={setIsForce}
          isForce={isForce}
        />
      </ActionForm>
    </Dialog>
  );
};

PermissionManagementDialog.displayName = displayName;

export default PermissionManagementDialog;
