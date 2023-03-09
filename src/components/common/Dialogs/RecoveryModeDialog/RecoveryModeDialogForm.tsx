import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import {
  DialogSection,
  ActionDialogProps,
  DialogControls,
  DialogHeading,
} from '~shared/Dialog';
import { Annotations } from '~shared/Fields';
import PermissionsLabel from '~shared/PermissionsLabel';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import ExternalLink from '~shared/ExternalLink';
import NoPermissionMessage from '~shared/NoPermissionMessage';

import { useAppContext, useTransformer } from '~hooks';
import { getAllUserRoles } from '~redux/transformers';
import { canEnterRecoveryMode } from '~utils/checks';

import { RECOVERY_HELP } from '~constants/externalUrls';

import styles from './RecoveryModeDialogForm.css';

const displayName = 'common.RecoveryModeDialog.RecoveryModeDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Enter Recovery mode',
  },
  recoveryModeDescription: {
    id: `${displayName}.recoveryModeDescription`,
    defaultMessage: `If you believe that something dangerous is happening in
    your colony (e.g. it is under attack), recovery mode will disable the colony
    and prevent further activity until the issue has been overcome.`,
  },
  leavingRecoveryModeDescription: {
    id: `${displayName}.leavingRecoveryModeDescription`,
    defaultMessage: `
    Leaving recovery requires the approval of a majority of members
    holding the {roleRequired} permission. <a>Learn more</a>`,
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage:
      'Explain why you’re putting this colony into recovery mode (optional)',
  },
});

const HelpLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={RECOVERY_HELP}>{chunks}</ExternalLink>
);

const RecoveryModeDialogForm = ({ back, colony }: ActionDialogProps) => {
  const { user } = useAppContext();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    user?.walletAddress,
  ]);

  const hasRegisteredProfile = !!user?.name && !!user?.walletAddress;

  const userHasPermission =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Recovery]} />
        </DialogSection>
      )}
      <DialogSection>
        <FormattedMessage {...MSG.recoveryModeDescription} />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.leavingRecoveryMessage}>
          <FormattedMessage
            {...MSG.leavingRecoveryModeDescription}
            values={{
              roleRequired: (
                <PermissionsLabel
                  permission={ColonyRole.Recovery}
                  name={{
                    id: `role.${ColonyRole.Recovery}`,
                  }}
                />
              ),
              a: HelpLink,
            }}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={!userHasPermission || isSubmitting}
          dataTest="recoveryAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={[ColonyRole.Recovery]} />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={!userHasPermission || isSubmitting}
          dataTest="recoveryConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default RecoveryModeDialogForm;
