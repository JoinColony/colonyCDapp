import React, { useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { Input, Annotations } from '~shared/Fields';
import {
  useActionDialogStatus,
  // useTransformer,
  // useAppContext,
} from '~hooks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { SetStateFn } from '~types';
// import { getAllUserRoles } from '~redux/transformers';
// import { hasRoot } from '~utils/checks';

import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
  NotEnoughReputation,
} from '../Messages';

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

const requiredRoles: ColonyRole[] = [ColonyRole.Root];

interface Props extends ActionDialogProps {
  handleIsForceChange: SetStateFn;
  isForce: boolean;
}

const MintTokenDialogForm = ({
  colony,
  back,
  enabledExtensionData,
  isForce,
  handleIsForceChange,
}: Props) => {
  const { watch } = useFormContext();
  const forceAction = watch('forceAction');

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
  // @TODO: Integrate those checks into another hook that uses useActionDialogStatus internally, when the data is made available.
  // const { wallet } = useAppContext();
  // const allUserRoles = useTransformer(getAllUserRoles, [
  //   colony,
  //   wallet?.address,
  // ]);

  // const canUserMintNativeToken = hasRoot(allUserRoles) && !!colony.status?.nativeToken?.mintable;

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

  useEffect(() => {
    if (forceAction !== isForce) {
      handleIsForceChange(forceAction);
    }
  }, [forceAction, isForce, handleIsForceChange]);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          colony={colony}
          userHasPermission={userHasPermission}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          isRootMotion
        />
      </DialogSection>
      {showPermissionErrors && (
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
              disabled={disabledInput}
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
            disabled={disabledInput}
          />
        </div>
      </DialogSection>
      {showPermissionErrors && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {canOnlyForceAction && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation includeForceCopy={userHasPermission} />
        </DialogSection>
      )}
      {!hasMotionCompatibleVersion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={disabledSubmit}
          dataTest="mintConfirmButton"
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

MintTokenDialogForm.displayName = displayName;

export default MintTokenDialogForm;
