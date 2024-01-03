import { ColonyRole, Id } from '@colony/colony-js';
import React, { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { MAX_COLONY_DISPLAY_NAME } from '~constants';
import { ExternalLinks } from '~gql';
import { useActionDialogStatus } from '~hooks';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { Annotations, Input, Select, Textarea } from '~shared/Fields';
import { SetStateFn } from '~types';
import { isEqual } from '~utils/lodash';

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
  description: {
    id: `${displayName}.description`,
    defaultMessage: 'Colony description',
  },
  logo: {
    id: `${displayName}.logo`,
    defaultMessage: 'Colony Logo (Optional)',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'Link',
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
  const {
    colonyAvatarImage,
    colonyDisplayName,
    colonyDescription,
    externalLinks,
    forceAction,
  } = watch();
  const [avatarFileError, setAvatarFileError] = useState<DropzoneErrors>();
  const { fields, append } = useFieldArray({ name: 'externalLinks' });
  useEffect(() => {
    if (forceAction !== isForce) {
      setIsForce(forceAction);
    }
  }, [forceAction, isForce, setIsForce]);

  const {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canOnlyForceAction,
    hasMotionCompatibleVersion,
    showPermissionErrors,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  // Using `isDirty` will validate the form if all you do is add an annotation
  const hasEditedColony =
    metadata?.displayName !== colonyDisplayName ||
    metadata?.avatar !== colonyAvatarImage ||
    (metadata?.description ?? '') !== colonyDescription ||
    !isEqual(metadata?.externalLinks, externalLinks);

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
      {showPermissionErrors && (
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
          maxLength={MAX_COLONY_DISPLAY_NAME}
          value={colonyDisplayName}
        />
      </DialogSection>
      <DialogSection>
        <Textarea
          label={MSG.description}
          name="colonyDescription"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
        />
      </DialogSection>
      <DialogSection>
        {fields.map(({ id }, index) => (
          <Fragment key={id}>
            <Select
              label="Link name"
              name={`externalLinks.${index}.name`}
              placeholder="Select a link"
              options={Object.values(ExternalLinks).map((link) => ({
                label: link,
                value: link,
              }))}
              appearance={{ theme: 'grey', size: 'medium' }}
            />
            <Input
              name={`externalLinks.${index}.link`}
              label="Link address"
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
              disabled={disabledInput}
            />
          </Fragment>
        ))}
        <button
          type="button"
          onClick={() => {
            append({ name: '', link: '' });
          }}
        >
          Add another link
        </button>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={disabledInput}
        />
      </DialogSection>
      {showPermissionErrors && (
        <DialogSection>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {canOnlyForceAction && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation
            appearance={{ marginTop: 'negative' }}
            includeForceCopy={userHasPermission}
          />
        </DialogSection>
      )}
      {!hasMotionCompatibleVersion && (
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
