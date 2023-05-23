import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { Annotations, HookFormInput as Input } from '~shared/Fields';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { useActionDialogStatus } from '~hooks';
import { SetStateFn } from '~types';

import {
  CannotCreateMotionMessage,
  NoPermissionMessage,
  NotEnoughReputation,
  PermissionRequiredInfo,
} from '../Messages';
import ColonyAvatarUploader from './ColonyAvatarUploader';

const displayName =
  'common.EditColonyDetailsDialog.EditColonyDetailsDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Edit colony details',
  },
  name: {
    id: `${displayName}.name`,
    defaultMessage: 'Colony name',
  },
  logo: {
    id: `${displayName}.logo`,
    defaultMessage: 'Colony Logo (Optional)',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you're editing the colony's details (optional)`,
  },
  invalidAvatarFormat: {
    id: `${displayName}.invalidAvatarFormat`,
    defaultMessage: `Image you tried to upload is in an invalid format`,
  },
});

const requiredRoles = [ColonyRole.Root];

interface EditColonyDetailsDialogFormProps extends ActionDialogProps {
  isForce: boolean;
  setIsForce: SetStateFn;
}

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  colony: { metadata },
  enabledExtensionData,
  isForce,
  setIsForce,
}: EditColonyDetailsDialogFormProps) => {
  const { watch } = useFormContext();
  const { colonyAvatarImage, colonyDisplayName, forceAction } = watch();
  const [avatarFileError, setAvatarFileError] = useState<DropzoneErrors>();

  useEffect(() => {
    if (forceAction !== isForce) {
      setIsForce(forceAction);
    }
  }, [forceAction, isForce, setIsForce]);

  const {
    userHasPermission,
    canCreateMotion,
    disabledInput,
    disabledSubmit,
    canOnlyForceAction,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  const hasEditedColony =
    metadata?.displayName !== colonyDisplayName ||
    metadata?.avatar !== colonyAvatarImage;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          userHasPermission={userHasPermission}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          isRootMotion
          colony={colony}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <ColonyAvatarUploader
          colony={colony}
          setAvatarFileError={setAvatarFileError}
          disabledInput={disabledInput}
          avatarFileError={avatarFileError}
        />
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.name}
          name="colonyDisplayName"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
          maxLength={20}
          value={colonyDisplayName}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={disabledInput}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {canOnlyForceAction && (
        <DialogSection>
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
          disabled={disabledSubmit || !!avatarFileError || !hasEditedColony}
          dataTest="confirmButton"
          onSecondaryButtonClick={back}
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

EditColonyDetailsDialogForm.displayName = displayName;

export default EditColonyDetailsDialogForm;
