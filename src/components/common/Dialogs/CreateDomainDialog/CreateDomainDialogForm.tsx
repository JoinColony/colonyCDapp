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
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import DomainNameAndColorInputGroup from '~shared/DomainNameAndColorInputGroup';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { useDialogActionPermissions } from '~hooks'; // useEnabledExtensions

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
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const CreateDomainDialogForm = ({ back, colony }: ActionDialogProps) => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];
  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    false, // isVotingExtensionEnabled,
    requiredRoles,
    [Id.RootDomain],
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

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
      )}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationExtensionVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )} */}
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
