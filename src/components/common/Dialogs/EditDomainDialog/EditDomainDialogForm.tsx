import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ColonyRole,
  Id,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FormState, UseFormSetValue } from 'react-hook-form';

import { Color, graphQlDomainColorMap } from '~types';
import Button from '~shared/Button';
import { ActionDialogProps, DialogSection } from '~shared/Dialog';
import ColorSelect from '~shared/ColorSelect';
import { HookFormInput as Input, Annotations, Select } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
// import ForceToggle from '~shared/Fields/ForceToggle';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import {
  useTransformer,
  useDialogActionPermissions,
  useAppContext,
} from '~hooks'; // useEnabledExtensions
import { getAllUserRoles } from '~redux/transformers';
import { canArchitect } from '~utils/checks';
import { DomainColor } from '~gql';
import { sortBy } from '~utils/lodash';

import { FormValues } from './EditDomainDialog';

import styles from './EditDomainDialogForm.css';

const displayName = 'common.ColonyHome.EditDomainDialog.EditDomainDialogForm';

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
    id: `${displayName}.name`,
    defaultMessage: 'What is the purpose of this team?',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re editing this team (optional)',
  },
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage:
      // eslint-disable-next-line max-len
      'You need the {roleRequired} permission in {domain} to take this action.',
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  isSubmitting: boolean;
  isValid: boolean;
  values: FormValues;
  setValue: UseFormSetValue<FormValues>;
}

const EditDomainDialogForm = ({
  back,
  colony,
  colony: { domains },
  isSubmitting,
  isValid,
  // setFieldValue,
  setValue,
  values: { domainId, domainName, forceAction, motionDomainId, domainPurpose },
}: Props & FormState<FormValues>) => {
  const [domainColor, setDomainColor] = useState(Color.LightPink);
  // const [currentFromDomain, setCurrentFromDomain] = useState<number>(
  //   parseInt(domainId || '', 10),
  // );
  const { wallet, user } = useAppContext();

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const hasRegisteredProfile = !!user?.name && !!wallet?.address;

  const colonyDomains = useMemo(() => domains?.items || [], [domains]);
  const domainOptions = useMemo(
    () =>
      sortBy(
        colonyDomains
          .filter((domain) => domain?.nativeId !== Id.RootDomain)
          .map((domain) => ({
            value: `${domain?.nativeId}`,
            label: domain?.name || `Domain #${domain?.nativeId}`,
          })),
        ['value'],
      ),

    [colonyDomains],
  );

  const hasRoles = hasRegisteredProfile && canArchitect(allUserRoles);

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    hasRoles,
    false, // isVotingExtensionEnabled,
    forceAction,
    Number(domainId),
  );

  const canEditDomain =
    userHasPermission && Object.keys(domainOptions).length > 0;

  const inputDisabled = !canEditDomain || onlyForceAction || isSubmitting;

  const handleDomainChange = useCallback(
    (selectedDomainValue) => {
      // const selectedMotionDomainId = parseInt(motionDomainId, 10);
      const selectedDomainId = parseInt(selectedDomainValue, 10);
      const selectedDomain = colonyDomains.find(
        (domain) => domain?.nativeId === selectedDomainId,
      );
      const selectedDomainColor =
        graphQlDomainColorMap[selectedDomain?.color || DomainColor.Lightpink];
      if (selectedDomain) {
        setValue('domainId', selectedDomain.nativeId.toString());
        setValue('domainColor', selectedDomainColor);
        setValue(
          'domainName',
          selectedDomain.name || `Domain #${selectedDomain?.nativeId}`,
        );
        setValue('domainPurpose', selectedDomain.description as string);
        setValue('forceAction', forceAction);
        setValue('motionDomainId', motionDomainId);
        setDomainColor(selectedDomainColor);
        // setCurrentFromDomain(selectedDomainId);
        // if (
        //   selectedMotionDomainId !== Id.RootDomain &&
        //   selectedMotionDomainId !== selectedDomainId
        // ) {
        //   setFieldValue('motionDomainId', selectedDomainId);
        // }
      }
      return null;
    },
    [colonyDomains, forceAction, motionDomainId, setValue],
  );

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

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {/*
           * @NOTE We can only create a motion to vote in a subdomain if we
           * create a payment from that subdomain
           */}
          {/* {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                onDomainChange={handleMotionDomainChange}
                disabled={forceAction}
                filterDomains={handleFilterMotionDomains}
                initialSelectedDomain={
                  motionDomainId === undefined
                    ? motionDomainId
                    : Number(motionDomainId)
                }
              />
            </div>
          )} */}
          <div className={styles.headingContainer}>
            <Heading3
              appearance={{ margin: 'none', theme: 'dark' }}
              text={MSG.titleEdit}
            />
            {/* {hasRoles && isVotingExtensionEnabled && (
              <ForceToggle disabled={!canEditDomain || isSubmitting} />
            )} */}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Architecture]} />
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
            activeOption={domainColor}
            appearance={{ alignOptions: 'right' }}
            onColorChange={setDomainColor}
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
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Architecture}
                    name={{ id: `role.${ColonyRole.Architecture}` }}
                  />
                ),
                domain: domainName,
              }}
            />
          </div>
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
        {back && (
          <Button
            text={{ id: 'button.back' }}
            onClick={back}
            appearance={{ theme: 'secondary', size: 'large' }}
          />
        )}
        <Button
          text={
            forceAction || true // || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          appearance={{ theme: 'primary', size: 'large' }}
          loading={isSubmitting}
          disabled={inputDisabled || !isValid} // cannotCreateMotion ||
          style={{ minWidth: styles.wideButton }}
          data-test="editDomainConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default EditDomainDialogForm;
