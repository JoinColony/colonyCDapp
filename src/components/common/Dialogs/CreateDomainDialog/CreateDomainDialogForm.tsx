import React, { useState } from 'react';
import {
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FormState } from 'react-hook-form';

import Button from '~shared/Button';
import ColorSelect from '~shared/ColorSelect';
import { ActionDialogProps, DialogSection } from '~shared/Dialog';
import { HookFormInput as Input, Annotations } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
// import ForceToggle from '~shared/Fields/ForceToggle';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { Color } from '~types';

import {
  useTransformer,
  useDialogActionPermissions,
  useAppContext,
} from '~hooks'; // useEnabledExtensions
import { getAllUserRoles } from '~redux/transformers';
import { canArchitect } from '~utils/checks';

import { FormValues } from './CreateDomainDialog';

import styles from './CreateDomainDialogForm.css';

const displayName =
  'common.ColonyHome.CreateDomainDialog.CreateDomainDialogForm';

const MSG = defineMessages({
  titleCreate: {
    id: `${displayName}.titleCreate`,
    defaultMessage: 'Create a new team',
  },
  name: {
    id: `${displayName}.name`,
    defaultMessage: 'Team name',
  },
  purpose: {
    id: `${displayName}.name`,
    defaultMessage: 'What is the purpose of this team?',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re creating this team (optional)',
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
}

const CreateDomainDialogForm = ({
  back,
  colony,
  isSubmitting,
  isValid,
  values,
}: Props & FormState<FormValues>) => {
  const [domainColor, setDomainColor] = useState(Color.LightPink);
  const { wallet, user } = useAppContext();

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const hasRegisteredProfile = !!user?.name && !!wallet?.address;
  const canCreateDomain = hasRegisteredProfile && canArchitect(allUserRoles);

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canCreateDomain,
    false, // isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {/*
           * @NOTE Always disabled since you can only create this motion in root
           */}
          {/* {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                disabled
              />
            </div>
          )} */}
          <div className={styles.headingContainer}>
            <Heading3
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.titleCreate}
            />
            {/* {canCreateDomain && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
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
            <Input
              label={MSG.name}
              name="teamName"
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
              disabled={inputDisabled}
              maxLength={20}
              dataTest="domainNameInput"
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
                domain: 'Root',
              }}
            />
          </div>
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
        {back && (
          <Button
            text={{ id: 'button.back' }}
            onClick={back}
            appearance={{ theme: 'secondary', size: 'large' }}
          />
        )}
        <Button
          text={
            values.forceAction || true // || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          appearance={{ theme: 'primary', size: 'large' }}
          loading={isSubmitting}
          disabled={inputDisabled || !isValid} // cannotCreateMotion ||
          style={{ minWidth: styles.wideButton }}
          data-test="createDomainConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default CreateDomainDialogForm;
