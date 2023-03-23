import React, { useState } from 'react';
import { Id } from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { string, object, array, number, boolean, InferType } from 'yup';

import { mergePayload, withKey, mapPayload, pipe, withMeta } from '~utils/actions';
import { ActionTypes } from '~redux';
import { WizardDialogType } from '~hooks';
import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { getPermissionManagementDialogPayload } from './helpers';
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

  const actionType =
    !isForce && isVotingReputationEnabled ? ActionTypes.MOTION_USER_ROLES_SET : ActionTypes.ACTION_USER_ROLES_SET;

  const transform = pipe(
    withKey(colonyAddress),
    mapPayload((payload) => getPermissionManagementDialogPayload(payload)),
    mergePayload({
      colonyAddress,
      colonyName: name,
    }),
    withMeta({ navigate }),
  );

  const defaultDomain = !preselectedDomainId ? Id.RootDomain : preselectedDomainId;

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          forceAction: false,
          user: null,
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
            />
          );
        }}
      </Form>
    </Dialog>
  );
};

PermissionManagementDialog.displayName = displayName;

export default PermissionManagementDialog;
