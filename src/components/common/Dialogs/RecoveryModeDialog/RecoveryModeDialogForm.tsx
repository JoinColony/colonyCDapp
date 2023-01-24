import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { FormState } from 'react-hook-form';

import Button from '~shared/Button';
import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import ExternalLink from '~shared/ExternalLink';

import { useAppContext, useTransformer } from '~hooks';
import { getAllUserRoles } from '~redux/transformers';
import { canEnterRecoveryMode } from '~utils/checks';

import { RECOVERY_HELP } from '~constants/externalUrls';
import { Colony } from '~types';

import { FormValues } from './RecoveryModeDialog';

import styles from './RecoveryModeDialogForm.css';

const displayName =
  'common.ColonyHome.RecoveryModeDialog.RecoveryModeDialogForm';

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
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
});

interface Props {
  back: () => void;
  colony: Colony;
}

const HelpLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={RECOVERY_HELP}>{chunks}</ExternalLink>
);

const RecoveryModeDialogForm = ({
  back,
  colony,
  isSubmitting,
}: Props & FormState<FormValues>) => {
  const { user } = useAppContext();

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    user?.walletAddress,
  ]);

  const hasRegisteredProfile = !!user?.name && !!user?.walletAddress;

  const userHasPermission =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading3
          appearance={{ margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
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
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Recovery}
                    name={{
                      id: `role.${ColonyRole.Recovery}`,
                    }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!userHasPermission || isSubmitting}
          style={{ minWidth: styles.wideButton }}
          data-test="recoveryConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default RecoveryModeDialogForm;
