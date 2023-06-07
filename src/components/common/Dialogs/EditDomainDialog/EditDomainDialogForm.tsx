import React, { useEffect } from 'react';
import { ColonyRole, Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import {
  HookFormInput as Input,
  Annotations,
  SelectOption,
} from '~shared/Fields';

import { DomainColor } from '~gql';
import { findDomainByNativeId } from '~utils/domains';
import { SetStateFn } from '~types';

import DomainNameAndColorInputGroup from '../DomainNameAndColorInputGroup';
import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
  NotEnoughReputation,
} from '../Messages';

import { useEditDomainDialogStatus } from './helpers';

const displayName = 'common.EditDomainDialog.EditDomainDialogForm';

const MSG = defineMessages({
  titleEdit: {
    id: `${displayName}.titleEdit`,
    defaultMessage: 'Edit team details',
  },
  name: {
    id: `${displayName}.name`,
    defaultMessage: 'Team name',
  },
  purpose: {
    id: `${displayName}.purpose`,
    defaultMessage: 'What is the purpose of this team?',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re editing this team (optional)',
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

interface Props extends ActionDialogProps {
  domainOptions: SelectOption[];
  handleIsForceChange: SetStateFn;
  isForce: boolean;
}

const EditDomainDialogForm = ({
  back,
  colony,
  domainOptions,
  enabledExtensionData,
  handleIsForceChange,
  isForce,
}: Props) => {
  const { watch, reset: resetForm } = useFormContext();
  const { domainName, domainPurpose, forceAction, domainId, motionDomainId } =
    watch();
  const {
    userHasPermission,
    disabledSubmit,
    disabledInput,
    canCreateMotion,
    canOnlyForceAction,
  } = useEditDomainDialogStatus(
    colony,
    requiredRoles,
    enabledExtensionData,
    domainOptions,
  );

  const handleDomainChange = (selectedDomainValue: number) => {
    const selectedDomain = findDomainByNativeId(selectedDomainValue, colony);
    const selectedDomainColor =
      selectedDomain?.metadata?.color || DomainColor.LightPink;

    if (selectedDomain) {
      resetForm({
        domainId: selectedDomain.nativeId,
        domainColor: selectedDomainColor,
        domainName:
          selectedDomain.metadata?.name || `Domain #${selectedDomain.nativeId}`,
        domainPurpose: selectedDomain.metadata?.description || '',
        forceAction,
        motionDomainId:
          /* @NOTE: We only want to update the motion domain id along with the selected domain for edit
           * if motionDomainId is different from the selected domain and it's NOT Root.
           *
           * This is done to avoid cases in which the user may select a subdomain of Root, and then change the selected
           * domain to another subdomain of Root. In cases like that, we need to change motion domain id because you can't create a motion
           * in a subdomain, to edit a "sibling" subdomain.
           */
          motionDomainId !== Id.RootDomain &&
          motionDomainId !== selectedDomainValue
            ? selectedDomain.nativeId
            : motionDomainId,
      });
    }
    return null;
  };

  useEffect(() => {
    if (forceAction !== isForce) {
      handleIsForceChange(forceAction);
    }
  }, [forceAction, isForce, handleIsForceChange]);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.titleEdit}
          colony={colony}
          userHasPermission={userHasPermission}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          selectedDomainId={domainId}
        />
      </DialogSection>
      {domainOptions.length > 0 && !userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <DomainNameAndColorInputGroup
          disabled={disabledInput}
          domainOptions={domainOptions}
          onSelectDomainChange={handleDomainChange}
        />
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.name}
          name="domainName"
          value={domainName || ''}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
          maxLength={20}
          dataTest="domainNameInput"
        />
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.purpose}
          name="domainPurpose"
          value={domainPurpose || ''}
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
          dataTest="editDomainAnnotation"
        />
      </DialogSection>
      {domainOptions.length > 0 && !userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage
            requiredPermissions={[ColonyRole.Architecture]}
            domainName={domainName}
          />
        </DialogSection>
      )}
      {canOnlyForceAction && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation
            appearance={{ marginTop: 'negative' }}
            domainId={domainId}
          />
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
          dataTest="editDomainConfirmButton"
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

export default EditDomainDialogForm;
