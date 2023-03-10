import React from 'react';
import { ColonyRole, Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { HookFormInput as Input, Annotations } from '~shared/Fields';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import CannotCreateMotionMessage from '~shared/CannotCreateMotionMessage';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import DomainNameAndColorInputGroup from '~shared/DomainNameAndColorInputGroup';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { noMotionsVotingReputationVersion } from '~utils/colonyMotions';

import { useDialogActionPermissions, useEnabledExtensions } from '~hooks';

const displayName = 'common.CreateDomainDialog.CreateDomainDialogForm';

const MSG = defineMessages({
  titleCreate: {
    id: `${displayName}.titleCreate`,
    defaultMessage: 'Create a new team',
  },
  purpose: {
    id: `${displayName}.name`,
    defaultMessage: 'What is the purpose of this team?',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re creating this team (optional)',
  },
});

const CreateDomainDialogForm = ({ back, colony }: ActionDialogProps) => {
  const {
    formState: { isValid, isSubmitting },
    getValues,
  } = useFormContext();
  const values = getValues();
  const { votingReputationVersion, isVotingReputationEnabled } =
    useEnabledExtensions(colony);

  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];
  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    isVotingReputationEnabled,
    requiredRoles,
    [Id.RootDomain],
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  const cannotCreateMotion =
    votingReputationVersion === noMotionsVotingReputationVersion &&
    !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.titleCreate} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Architecture]} />
        </DialogSection>
      )}
      <DialogSection>
        <DomainNameAndColorInputGroup
          isCreatingDomain
          disabled={inputDisabled}
        />
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.purpose}
          name="domainPurpose"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={inputDisabled}
          maxLength={90}
          dataTest="domainPurposeInput"
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
          dataTest="createDomainAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage
            requiredPermissions={[ColonyRole.Architecture]}
            domainName="Root"
          />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )} */}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={inputDisabled || !isValid}
          dataTest="createDomainConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default CreateDomainDialogForm;
