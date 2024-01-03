import { ColonyRole } from '@colony/colony-js';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useAppContext, useTransformer } from '~hooks';
import {
  DialogSection,
  ActionDialogProps,
  DialogControls,
  DialogHeading,
} from '~shared/Dialog';
import { Annotations } from '~shared/Fields';
import { getAllUserRoles } from '~transformers';
import { canEnterRecoveryMode } from '~utils/checks';

import { NoPermissionMessage, PermissionRequiredInfo } from '../Messages';

import styles from './RecoveryModeDialogForm.css';

const displayName = 'common.RecoveryModeDialog.RecoveryModeDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Enter Recovery mode',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage:
      'Explain why you’re putting this colony into recovery mode (optional)',
  },
});

const RecoveryModeDialogForm = ({
  back,
  colony,
  enabledExtensionData,
}: ActionDialogProps) => {
  const { user } = useAppContext();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    user?.walletAddress,
  ]);

  const hasRegisteredProfile =
    !!user?.profile?.displayName && !!user?.walletAddress;

  const userHasPermission =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          colony={colony}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          userHasPermission={userHasPermission}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Recovery]} />
        </DialogSection>
      )}
      <DialogSection>
        <FormattedMessage id="advancedPage.recovery.description" />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.leavingRecoveryMessage}>
          <FormattedMessage id="advancedPage.recovery.notification" />
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
