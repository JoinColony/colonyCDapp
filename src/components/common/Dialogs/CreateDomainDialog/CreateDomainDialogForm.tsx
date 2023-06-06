import React from 'react';
import { ColonyRole, Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionDialogProps, DialogControls, DialogHeading, DialogSection } from '~shared/Dialog';
import { HookFormInput as Input, Annotations } from '~shared/Fields';

// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { useActionDialogStatus } from '~hooks';

import DomainNameAndColorInputGroup from '../DomainNameAndColorInputGroup';
import { NoPermissionMessage, CannotCreateMotionMessage, PermissionRequiredInfo } from '../Messages';

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

const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

const CreateDomainDialogForm = ({ back, colony, enabledExtensionData }: ActionDialogProps) => {
  const { userHasPermission, disabledInput, disabledSubmit, canCreateMotion } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );
  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.titleCreate} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <DomainNameAndColorInputGroup isCreatingDomain disabled={disabledInput} />
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.purpose}
          name="domainPurpose"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
          maxLength={90}
          dataTest="domainPurposeInput"
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={disabledInput}
          dataTest="createDomainAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} domainName="Root" />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )} */}
      {!canCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={disabledSubmit}
          dataTest="createDomainConfirmButton"
          isVotingReputationEnabled={enabledExtensionData.isVotingReputationEnabled}
        />
      </DialogSection>
    </>
  );
};

export default CreateDomainDialogForm;
