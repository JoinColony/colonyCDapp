import { Id } from '@colony/colony-js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, array, number, boolean, InferType } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { WizardDialogType } from '~hooks';
import { ActionTypes } from '~redux';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionForm } from '~shared/Fields';
import {
  mergePayload,
  withKey,
  mapPayload,
  pipe,
  withMeta,
} from '~utils/actions';

import { getPermissionManagementDialogPayload } from './helpers';
import PermissionManagementForm from './PermissionManagementForm';

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

  /*
   * @TODO This also needs a list of all users that have, or had permissions within
   * this colony even though they don't have an account created (or are a colony,
   * extension, token, or a random address)
   */
  const users = [];

  const defaultUser = undefined;

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
