import React from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { ActionDialogProps, DialogControls, DialogHeading, DialogSection } from '~shared/Dialog';
import { HookFormInput as Input, Annotations, SelectOption } from '~shared/Fields';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { DomainColor } from '~gql';
import { findDomainByNativeId } from '~utils/domains';

import DomainNameAndColorInputGroup from '../DomainNameAndColorInputGroup';
import { NoPermissionMessage, CannotCreateMotionMessage, PermissionRequiredInfo } from '../Messages';

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
}

const EditDomainDialogForm = ({ back, colony, domainOptions, enabledExtensionData }: Props) => {
  const { watch, reset: resetForm } = useFormContext();
  const { domainName, domainPurpose, forceAction } = watch();
  const { userHasPermission, disabledSubmit, disabledInput, canCreateMotion } = useEditDomainDialogStatus(
    colony,
    requiredRoles,
    enabledExtensionData,
  );

  const handleDomainChange = (selectedDomainValue: number) => {
    const selectedDomain = findDomainByNativeId(selectedDomainValue, colony);
    const selectedDomainColor = selectedDomain?.metadata?.color || DomainColor.LightPink;

    if (selectedDomain) {
      resetForm({
        domainId: selectedDomain.nativeId,
        domainColor: selectedDomainColor,
        domainName: selectedDomain.metadata?.name || `Domain #${selectedDomain.nativeId}`,
        domainPurpose: selectedDomain.metadata?.description || '',
        forceAction,
      });
      // if (
      //   selectedMotionDomainId !== Id.RootDomain &&
      //   selectedMotionDomainId !== selectedDomainId
      // ) {
      //   setFieldValue('motionDomainId', selectedDomainId);
      // }
    }
    return null;
  };

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.titleEdit} />
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
          <NoPermissionMessage requiredPermissions={[ColonyRole.Architecture]} domainName={domainName} />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={Number(domainId)}
        />
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
