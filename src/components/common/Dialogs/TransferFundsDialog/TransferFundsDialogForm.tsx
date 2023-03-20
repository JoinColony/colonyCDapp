import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { Annotations } from '~shared/Fields';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
} from '../Messages';
import TokenAmountInput from '../TokenAmountInput';
import DomainFundSelectorSection from '../DomainFundSelectorSection';

import { useTransferFundsDialogStatus } from './helpers';

import styles from './TransferFundsDialogForm.css';

const displayName = 'common.TransferFundsDialog.TransferFundsDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Transfer Funds',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re transferring these funds (optional)',
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const requiredRoles: ColonyRole[] = [ColonyRole.Funding];

const TransferFundsDialogForm = ({
  back,
  colony,
  enabledExtensionData,
}: ActionDialogProps) => {
  const { watch } = useFormContext();
  const { fromDomain: fromDomainId, toDomain: toDomainId } = watch();

  const colonyDomains = colony?.domains?.items || [];
  const fromDomain = colonyDomains.find(
    (domain) => domain?.nativeId === fromDomainId,
  );

  const toDomain = colonyDomains.find(
    (domain) => domain?.nativeId === toDomainId,
  );
  const {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canOnlyForceAction,
    hasRoleInFromDomain,
  } = useTransferFundsDialogStatus(colony, requiredRoles, enabledExtensionData);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {!userHasPermission && (
        <div className={styles.permissionsRequired}>
          <DialogSection>
            <PermissionRequiredInfo requiredRoles={requiredRoles} />
          </DialogSection>
        </div>
      )}
      <DialogSection>
        <DomainFundSelectorSection
          colony={colony}
          transferBetweenDomains
          disabled={canOnlyForceAction}
        />
      </DialogSection>
      <DialogSection>
        <TokenAmountInput colony={colony} disabled={disabledInput} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={disabledInput}
          dataTest="transferFundsAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage
            requiredPermissions={requiredRoles}
            domainName={
              hasRoleInFromDomain
                ? fromDomain?.metadata?.name
                : toDomain?.metadata?.name
            }
          />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
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
          dataTest="transferFundsConfirmation"
        />
      </DialogSection>
    </>
  );
};

TransferFundsDialogForm.displayName = displayName;

export default TransferFundsDialogForm;
