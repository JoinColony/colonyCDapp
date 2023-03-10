import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import TokenAmountInput from '~shared/TokenAmountInput';
import DomainFundSelectorSection from '~shared/DomainFundSelectorSection';
import CannotCreateMotionMessage from '~shared/CannotCreateMotionMessage';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
} from '~shared/Dialog';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import {
  useAppContext,
  useDialogActionPermissions,
  useTransformer,
  useEnabledExtensions,
} from '~hooks';
import { getUserRolesForDomain } from '~redux/transformers';
import { userHasRole } from '~utils/checks';
import { noMotionsVotingReputationVersion } from '~utils/colonyMotions';

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

const TransferFundsDialogForm = ({ back, colony }: ActionDialogProps) => {
  const { wallet } = useAppContext();
  const {
    getValues,
    formState: { isSubmitting, isValid },
  } = useFormContext();
  const values = getValues();

  const { isVotingReputationEnabled, votingReputationVersion } =
    useEnabledExtensions(colony);

  const fromDomainId = values.fromDomain ? values.fromDomain : Id.RootDomain;
  const colonyDomains = colony?.domains?.items || [];
  const fromDomain = colonyDomains.find(
    (domain) => domain?.nativeId === fromDomainId,
  );
  const toDomainId = values.toDomain ? values.toDomain : undefined;
  const toDomain = colonyDomains.find(
    (domain) => domain?.nativeId === toDomainId,
  );

  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    fromDomainId,
  ]);

  const toDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    toDomainId,
  ]);
  const hasRoleInFromDomain = userHasRole(fromDomainRoles, ColonyRole.Funding);

  const requiredRoles: ColonyRole[] = [ColonyRole.Funding];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    isVotingReputationEnabled,
    requiredRoles,
    [fromDomainId, toDomainId],
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  const cannotCreateMotion =
    votingReputationVersion === noMotionsVotingReputationVersion &&
    !values.forceAction;

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
          disabled={onlyForceAction}
        />
      </DialogSection>
      <DialogSection>
        <TokenAmountInput colony={colony} disabled={inputDisabled} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
          dataTest="transferFundsAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage
            requiredPermissions={[ColonyRole.Funding]}
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
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={cannotCreateMotion || !isValid || inputDisabled}
          dataTest="transferFundsConfirmation"
        />
      </DialogSection>
    </>
  );
};

TransferFundsDialogForm.displayName = displayName;

export default TransferFundsDialogForm;
