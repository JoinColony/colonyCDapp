import React from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { HookFormInput as Input, Annotations } from '~shared/Fields';
import { getDomainOptions } from '~shared/DomainFundSelectorSection/helpers';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import DomainNameAndColorInputGroup from '~shared/DomainNameAndColorInputGroup';
import CannotCreateMotionMessage from '~shared/CannotCreateMotionMessage';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { useDialogActionPermissions, useEnabledExtensions } from '~hooks';
import { DomainColor } from '~gql';
import { notNull } from '~utils/arrays';
import { findDomainByNativeId } from '~utils/domains';
import { noMotionsVotingReputationVersion } from '~utils/colonyMotions';

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

const EditDomainDialogForm = ({
  back,
  colony,
  colony: { domains },
}: ActionDialogProps) => {
  const {
    getValues,
    formState: { isValid, isSubmitting, dirtyFields },
    reset: resetForm,
  } = useFormContext();
  const { domainId, domainName, domainPurpose, forceAction } = getValues();

  const colonyDomains = domains?.items.filter(notNull) || [];
  const domainOptions = getDomainOptions(colonyDomains, true);

  const { votingReputationVersion, isVotingReputationEnabled } =
    useEnabledExtensions(colony);

  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];
  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    isVotingReputationEnabled,
    requiredRoles,
    [domainId],
    domainId,
  );

  const inputDisabled =
    !userHasPermission ||
    onlyForceAction ||
    isSubmitting ||
    domainOptions.length === 0;

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

  const cannotCreateMotion =
    votingReputationVersion === noMotionsVotingReputationVersion &&
    !forceAction;
  const hasEditedDomain =
    dirtyFields.domainColor ||
    dirtyFields.domainName ||
    dirtyFields.domainPurpose;

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
          disabled={inputDisabled}
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
          disabled={inputDisabled}
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
      {/* {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={Number(domainId)}
        />
      )} */}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={
            cannotCreateMotion || inputDisabled || !isValid || !hasEditedDomain
          }
          dataTest="editDomainConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default EditDomainDialogForm;
