import React, { useEffect } from 'react';
import {
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { graphQlDomainColorMap } from '~types';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import ColorSelect from '~shared/ColorSelect';
import { HookFormInput as Input, Annotations, Select } from '~shared/Fields';
import { getDomainOptions } from '~shared/DomainFundSelectorSection/helpers';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { useDialogActionPermissions } from '~hooks'; // useEnabledExtensions
import { DomainColor } from '~gql';
import { notNull } from '~utils/arrays';

import styles from './EditDomainDialogForm.css';

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
  team: {
    id: `${displayName}.team`,
    defaultMessage: 'Select team',
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
  // const [currentFromDomain, setCurrentFromDomain] = useState<number>(
  //   parseInt(domainId || '', 10),
  // );

  const colonyDomains = domains?.items.filter(notNull) || [];
  const domainOptions = getDomainOptions(colonyDomains, true);

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
    [domainId],
    domainId,
  );

  const canEditDomain =
    userHasPermission && Object.keys(domainOptions).length > 0;

  const inputDisabled = !canEditDomain || onlyForceAction || isSubmitting;

  const handleDomainChange = (selectedDomainValue) => {
    const selectedDomain = colonyDomains.find(
      (domain) => domain?.nativeId === selectedDomainValue,
    );
    const selectedDomainColor =
      graphQlDomainColorMap[selectedDomain?.color || DomainColor.Lightpink];

    if (selectedDomain) {
      resetForm({
        domainId: selectedDomain.nativeId,
        domainColor: selectedDomainColor,
        domainName: selectedDomain.name || `Domain #${selectedDomain.nativeId}`,
        domainPurpose: selectedDomain.description || '',
        forceAction,
      });
      // setCurrentFromDomain(selectedDomainId);
      // if (
      //   selectedMotionDomainId !== Id.RootDomain &&
      //   selectedMotionDomainId !== selectedDomainId
      // ) {
      //   setFieldValue('motionDomainId', selectedDomainId);
      // }
    }
    return null;
  };

  // const handleFilterMotionDomains = useCallback(
  //   (optionDomain) => {
  //     const optionDomainId = parseInt(optionDomain.value, 10);
  //     if (currentFromDomain === Id.RootDomain) {
  //       return optionDomainId === Id.RootDomain;
  //     }
  //     return (
  //       optionDomainId === currentFromDomain ||
  //       optionDomainId === Id.RootDomain
  //     );
  //   },
  //   [currentFromDomain],
  // );

  // const handleMotionDomainChange = useCallback(
  //   (motionDomainIdValue) =>
  //     setFieldValue('motionDomainId', motionDomainIdValue),
  //   [setFieldValue],
  // );

  useEffect(() => {
    if (domainId) {
      handleDomainChange(domainId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !forceAction;
  const hasEditedDomain =
    dirtyFields.domainColor ||
    dirtyFields.domainName ||
    dirtyFields.domainPurpose;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.titleEdit} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.nameAndColorContainer}>
          <div className={styles.domainName}>
            <Select
              options={domainOptions}
              label={MSG.team}
              onChange={handleDomainChange}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
              disabled={isSubmitting}
              dataTest="domainIdSelector"
              itemDataTest="domainIdItem"
            />
          </div>
          <ColorSelect
            appearance={{ alignOptions: 'right' }}
            disabled={inputDisabled}
            name="domainColor"
          />
        </div>
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
      {!userHasPermission && (
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
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={inputDisabled || !isValid || !hasEditedDomain} // cannotCreateMotion ||
          dataTest="editDomainConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default EditDomainDialogForm;
