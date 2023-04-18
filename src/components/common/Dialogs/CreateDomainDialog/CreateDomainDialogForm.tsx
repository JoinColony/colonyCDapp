import React, { Dispatch, SetStateAction, useEffect } from 'react';
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

import { useActionDialogStatus } from '~hooks';

import DomainNameAndColorInputGroup from '../DomainNameAndColorInputGroup';
import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
  NotEnoughReputation,
} from '../Messages';

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

interface Props extends ActionDialogProps {
  handleIsForceChange: Dispatch<SetStateAction<boolean>>;
  isForce: boolean;
}

const CreateDomainDialogForm = ({
  back,
  colony,
  enabledExtensionData,
  enabledExtensionData: { isVotingReputationEnabled },
  handleIsForceChange,
  isForce,
}: Props) => {
  const { watch } = useFormContext();
  const forceAction = watch('forceAction');
  const {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canOnlyForceAction,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  useEffect(() => {
    if (forceAction !== isForce) {
      handleIsForceChange(forceAction);
    }
  }, [forceAction, isForce, handleIsForceChange]);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.titleCreate}
          colony={colony}
          userHasPermission={userHasPermission}
          isVotingExtensionEnabled={isVotingReputationEnabled}
          isRootMotion
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <DomainNameAndColorInputGroup
          isCreatingDomain
          disabled={disabledInput}
        />
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
          <NoPermissionMessage
            requiredPermissions={requiredRoles}
            domainName="Root"
          />
        </DialogSection>
      )}
      {canOnlyForceAction && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
        </DialogSection>
      )}
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
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

export default CreateDomainDialogForm;
