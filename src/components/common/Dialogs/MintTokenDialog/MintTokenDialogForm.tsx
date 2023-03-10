import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { ColonyRole, Id } from '@colony/colony-js';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { HookFormInput as Input, Annotations } from '~shared/Fields';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { noMotionsVotingReputationVersion } from '~utils/colonyMotions';
import {
  // useTransformer,
  useDialogActionPermissions,
  // useAppContext,
  useEnabledExtensions,
} from '~hooks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import CannotCreateMotionMessage from '~shared/CannotCreateMotionMessage';

// import { getAllUserRoles } from '~redux/transformers';
// import { hasRoot } from '~utils/checks';

import styles from './MintTokenDialogForm.css';

const displayName = 'common.MintTokenDialog.MintTokenDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.dialogTitle`,
    defaultMessage: 'Mint new tokens',
  },
  amountLabel: {
    id: `${displayName}.amountLabel`,
    defaultMessage: 'Amount',
  },
  annotationLabel: {
    id: `${displayName}.annotationLabel`,
    defaultMessage: `Explain why you're minting more tokens (optional)`,
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const MintTokenDialogForm = ({ colony, back }: ActionDialogProps) => {
  const {
    formState: { isValid, isSubmitting },
    getValues,
  } = useFormContext();
  const values = getValues();
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];
  // const { wallet } = useAppContext();
  // const allUserRoles = useTransformer(getAllUserRoles, [
  //   colony,
  //   wallet?.address,
  // ]);

  // const canUserMintNativeToken = hasRoot(allUserRoles) && !!colony.status?.nativeToken?.mintable;

  const { votingReputationVersion, isVotingReputationEnabled } =
    useEnabledExtensions(colony);

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    isVotingReputationEnabled,
    requiredRoles,
    [Id.RootDomain],
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  const cannotCreateMotion =
    votingReputationVersion === noMotionsVotingReputationVersion &&
    !values.forceAction;

  const formattingOptions = useMemo(
    () => ({
      numeral: true,
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(
        colony?.nativeToken?.decimals,
      ),
    }),
    [colony],
  );

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.inputContainer}>
          <div className={styles.inputComponent}>
            <Input
              appearance={{ theme: 'minimal' }}
              formattingOptions={formattingOptions}
              label={MSG.amountLabel}
              name="mintAmount"
              disabled={inputDisabled}
            />
          </div>
          <span
            className={styles.nativeToken}
            title={colony?.nativeToken?.name || undefined}
          >
            {colony?.nativeToken?.symbol}
          </span>
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotation}>
          <Annotations
            label={MSG.annotationLabel}
            name="annotation"
            disabled={inputDisabled}
          />
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={[ColonyRole.Root]} />
        </DialogSection>
      )}
      {/* {onlyForceAction && <NotEnoughReputation />} */}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={cannotCreateMotion || !isValid || inputDisabled}
          dataTest="mintConfirmButton"
        />
      </DialogSection>
    </>
  );
};

MintTokenDialogForm.displayName = displayName;

export default MintTokenDialogForm;
