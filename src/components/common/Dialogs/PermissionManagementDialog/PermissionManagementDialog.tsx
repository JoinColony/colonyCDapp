import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  Id,
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { useNavigate } from 'react-router-dom';
import { string, object, array, number, boolean } from 'yup';

import {
  mergePayload,
  withKey,
  mapPayload,
  pipe,
  withMeta,
} from '~utils/actions';
import { ActionTypes } from '~redux/index';
import {
  useTransformer,
  WizardDialogType,
  useDialogActionPermissions,
  useAppContext,
} from '~hooks'; // useEnabledExtensions
import Button from '~shared/Button';
import PermissionsLabel from '~shared/PermissionsLabel';
import Dialog, {
  ActionDialogProps,
  DialogProps,
  DialogSection,
} from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
import { SpinnerLoader } from '~shared/Preloaders';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { getUserRolesForDomain, getAllRootAccounts } from '~redux/transformers';
import { isEqual, sortBy } from '~utils/lodash';

import { availableRoles } from './constants';
import PermissionManagementForm from './PermissionManagementForm';

import styles from './PermissionManagementDialog.css';

const validationSchema = object()
  .shape({
    domainId: number().required(),
    user: object()
      .shape({
        profile: object()
          .shape({
            walletAddress: string().address().required(),
            displayName: string(),
          })
          .defined(),
      })
      .defined(),
    roles: array().ensure().of(number().defined()).defined(),
    annotation: string().max(4000).defined(),
    forceAction: boolean(),
    motionDomainId: number(),
  })
  .defined();

const displayName = 'common.ColonyHome.PermissionManagementDialog';

const MSG = defineMessages({
  noPermissionFrom: {
    id: `${displayName}.noPermissionFrom`,
    defaultMessage: `You do not have the {roleRequired} permission required to take this action.`,
  },
});

export interface FormValues {
  domainId: number;
  user: {
    profile: {
      walletAddress: string;
      displayName?: string;
    };
  };
  roles: ColonyRole[];
  annotation: string;
  forceAction: boolean;
  motionDomainId: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps & {
    ethDomainId?: number;
  };

const PermissionManagementDialog = ({
  colony: { colonyAddress, name, domains },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  ethDomainId: preselectedDomainId,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  // const {
  //   isVotingExtensionEnabled,
  //   votingExtensionVersion,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce // isVotingExtensionEnabled &&
        ? ActionTypes[`MOTION_USER_ROLES_SET${actionEnd}`]
        : ActionTypes[`ACTION_USER_ROLES_SET${actionEnd}`];
    },
    [isForce], // isVotingExtensionEnabled,
  );
  const { user: currentUser } = useAppContext();

  const [selectedUserAddress, setSelectedUserAddress] = useState<string>(
    currentUser?.walletAddress || '',
  );

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    !preselectedDomainId ? Id.RootDomain : preselectedDomainId,
  );
  const [selectedMotionDomainId, setSelectedMoitonDomainId] =
    useState<number>(selectedDomainId);

  const currentUserRoles = useTransformer(getUserRolesForDomain, [
    colony,
    // CURRENT USER!
    currentUser?.walletAddress,
    selectedDomainId,
  ]);

  const currentUserRolesInRoot = useTransformer(getUserRolesForDomain, [
    colony,
    currentUser?.walletAddress,
    Id.RootDomain,
  ]);

  const userDirectRoles = useTransformer(getUserRolesForDomain, [
    colony,
    // USER TO SET PERMISSIONS FOR!
    selectedUserAddress,
    selectedDomainId,
    true,
  ]);

  const userInheritedRoles = useTransformer(getUserRolesForDomain, [
    colony,
    // USER TO SET PERMISSIONS FOR!
    selectedUserAddress,
    selectedDomainId,
  ]);

  const rootAccounts = useTransformer(getAllRootAccounts, [colony]);

  const transform = useCallback(
    () =>
      pipe(
        withKey(colonyAddress),
        mapPayload(
          ({ roles, user, domainId, annotationMessage, motionDomainId }) => ({
            domainId,
            userAddress: user.profile.walletAddress,
            roles: availableRoles.reduce(
              (acc, role) => ({
                ...acc,
                [role]: roles.includes(role),
              }),
              {},
            ),
            annotationMessage,
            motionDomainId: parseInt(motionDomainId, 10),
          }),
        ),
        mergePayload({
          colonyAddress,
          colonyName: name,
        }),
        withMeta({ navigate }),
      ),
    [colonyAddress, navigate, name],
  );

  const colonyDomains = useMemo(() => domains?.items || [], [domains]);
  const domain = colonyDomains?.find(
    (colonyDomain) => colonyDomain?.nativeId === selectedDomainId,
  );

  const canEditPermissions =
    (selectedDomainId === Id.RootDomain &&
      currentUserRolesInRoot.includes(ColonyRole.Root)) ||
    currentUserRolesInRoot.includes(ColonyRole.Architecture);

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canEditPermissions,
    false, // isVotingExtensionEnabled,
    isForce,
    Number(selectedDomainId),
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

  return (
    <Dialog cancel={cancel}>
      {!selectedUserAddress || !colony || !domain ? (
        <SpinnerLoader />
      ) : (
        <Form<FormValues>
          defaultValues={{
            forceAction: false,
            user: undefined,
            domainId: selectedDomainId,
            roles: [...new Set([...userDirectRoles, ...userInheritedRoles])],
            annotation: '',
            motionDomainId: selectedMotionDomainId.toString(),
          }}
          validationSchema={validationSchema}
          onSuccess={close}
          submit={getFormAction('SUBMIT')}
          error={getFormAction('ERROR')}
          success={getFormAction('SUCCESS')}
          transform={transform}
        >
          {({ formState, getValues }) => {
            const { isSubmitting, isValid, defaultValues } = formState;
            const values = getValues();
            if (values.forceAction !== isForce) {
              setIsForce(values.forceAction);
            }
            return (
              <div className={styles.dialogContainer}>
                <PermissionManagementForm
                  {...formState}
                  values={values}
                  colony={colony}
                  currentUserRoles={currentUserRoles}
                  domainId={selectedDomainId}
                  rootAccounts={rootAccounts}
                  userDirectRoles={userDirectRoles}
                  currentUserRolesInRoot={currentUserRolesInRoot}
                  userInheritedRoles={userInheritedRoles}
                  onDomainSelected={setSelectedDomainId}
                  onMotionDomainChange={setSelectedMoitonDomainId}
                  onChangeSelectedUser={setSelectedUserAddress}
                  inputDisabled={inputDisabled || isSubmitting}
                  userHasPermission={userHasPermission}
                />
                {!userHasPermission && (
                  <DialogSection appearance={{ theme: 'sidePadding' }}>
                    <div className={styles.noPermissionFromMessage}>
                      <FormattedMessage
                        {...MSG.noPermissionFrom}
                        values={{
                          roleRequired: (
                            <PermissionsLabel
                              permission={ColonyRole.Architecture}
                              name={{ id: `role.${ColonyRole.Architecture}` }}
                            />
                          ),
                        }}
                      />
                    </div>
                  </DialogSection>
                )}
                {/* {onlyForceAction && (
                  <NotEnoughReputation domainId={Number(values.domainId)} />
                )} */}
                <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
                  <Button
                    appearance={{ theme: 'secondary', size: 'large' }}
                    onClick={
                      prevStep === undefined || callStep === undefined
                        ? cancel
                        : () => callStep(prevStep)
                    }
                    text={{
                      id:
                        prevStep === undefined || callStep === undefined
                          ? 'button.cancel'
                          : 'button.back',
                    }}
                  />
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    loading={isSubmitting}
                    text={
                      values.forceAction || true // || !isVotingExtensionEnabled
                        ? { id: 'button.confirm' }
                        : { id: 'button.createMotion' }
                    }
                    type="submit"
                    style={{ minWidth: styles.wideButton }}
                    disabled={
                      // (votingExtensionVersion ===
                      //   // eslint-disable-next-line max-len
                      //   VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
                      //   !values.forceAction) ||
                      inputDisabled ||
                      !isValid ||
                      isEqual(
                        sortBy(values.roles),
                        sortBy(defaultValues?.roles),
                      ) ||
                      isSubmitting
                    }
                    data-test="permissionConfirmButton"
                  />
                </DialogSection>
              </div>
            );
          }}
        </Form>
      )}
    </Dialog>
  );
};

PermissionManagementDialog.displayName = displayName;

export default PermissionManagementDialog;
