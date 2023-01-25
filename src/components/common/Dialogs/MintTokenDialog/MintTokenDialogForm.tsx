import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormState } from 'react-hook-form';
import {
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';

// import { Token } from '~gql';
import Button from '~shared/Button';
import { ActionDialogProps } from '~shared/Dialog';
import DialogSection from '~shared/Dialog/DialogSection';
import { HookFormInput as Input, Annotations } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import PermissionsLabel from '~shared/PermissionsLabel';
// import ForceToggle from '~shared/Fields/ForceToggle';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import {
  // useTransformer,
  useDialogActionPermissions,
  // useAppContext,
} from '~hooks'; // useEnabledExtensions
import { getTokenDecimalsWithFallback } from '~utils/tokens';

// import { getAllUserRoles } from '~redux/transformers';
// import { hasRoot } from '~utils/checks';
import { Colony } from '~types';

import { FormValues } from './MintTokenDialog';

import styles from './MintTokenDialogForm.css';

const displayName = 'common.ColonyHome.MintTokenDialog.MintTokenDialogForm';

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
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  values: FormValues;
  nativeToken?: Colony['nativeToken'];
}

const MintTokenDialogForm = ({
  colony,
  back,
  isSubmitting,
  isValid,
  nativeToken,
  values,
}: Props & FormState<FormValues>) => {
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];
  // const { wallet } = useAppContext();
  // const allUserRoles = useTransformer(getAllUserRoles, [
  //   colony,
  //   wallet?.address,
  // ]);

  const canUserMintNativeToken = true; // hasRoot(allUserRoles) && !!colony.status?.nativeToken?.mintable;

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canUserMintNativeToken,
    false, // isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  const formattingOptions = useMemo(
    () => ({
      numeral: true,
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(nativeToken?.decimals),
    }),
    [nativeToken],
  );

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
              appearance={{ margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
            {/* {canUserMintNativeToken && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )} */}
          </div>
        </div>
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
            title={nativeToken?.name || undefined}
          >
            {nativeToken?.symbol}
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
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Root}
                    name={{
                      id: `role.${ColonyRole.Root}`,
                    }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      {/* {onlyForceAction && <NotEnoughReputation />}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionMessage}>
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
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={
            values.forceAction || true // || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          disabled={!isValid || inputDisabled} // cannotCreateMotion ||
          style={{ minWidth: styles.wideButton }}
          data-test="mintConfirmButton"
        />
      </DialogSection>
    </>
  );
};

MintTokenDialogForm.displayName = displayName;

export default MintTokenDialogForm;
