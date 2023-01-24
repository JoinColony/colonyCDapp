import React, { useMemo } from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages, FormattedMessage } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { FormState } from 'react-hook-form';

import Button from '~shared/Button';
import { ActionDialogProps, DialogSection } from '~shared/Dialog';
import { Annotations } from '~shared/Fields';
import { Heading3, Heading4 } from '~shared/Heading';
import Paragraph from '~shared/Paragraph';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import PermissionsLabel from '~shared/PermissionsLabel';
import { TokenSelector } from '~common/CreateColonyWizard';
import {
  TokenManagementDialogFormValues,
  FormattedListToken,
} from '~common/Dialogs';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import {
  useTransformer,
  useAppContext,
  useDialogActionPermissions,
} from '~hooks';
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';
import { isEqual } from '~utils/lodash';

import TokenItem from './TokenItem';

import styles from './TokenEditDialog.css';

const displayName = 'TokenEditDialog';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Manage tokens',
  },
  fieldLabel: {
    id: `${displayName}.fieldLabel`,
    defaultMessage: 'Contract address',
  },
  textareaLabel: {
    id: `${displayName}.textareaLabel`,
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  noTokensText: {
    id: `${displayName}.noTokensText`,
    defaultMessage: `It looks no tokens have been added yet. Get started using the form above.`,
  },
  notListedToken: {
    id: `${displayName}.notListedToken`,
    defaultMessage: `If token is not listed above, please add any ERC20 compatible token contract address below.`,
  },
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
});

interface Props extends ActionDialogProps {
  close: (val: any) => void;
  values: TokenManagementDialogFormValues;
  // Token list from json file. Not supported on local env
  tokensList?: FormattedListToken[];
}

const TokenEditDialog = ({
  close,
  tokensList = [],
  colony,
  colony: { tokens, nativeToken },
  back,
  isSubmitting,
  isValid,
  values,
}: // isVotingExtensionEnabled,
Props & FormState<TokenManagementDialogFormValues>) => {
  const { user, wallet } = useAppContext();

  const colonyTokens = useMemo(() => tokens?.items || [], [tokens]);
  const colonyTokenAddresses = useMemo(
    () => colonyTokens.map((colonyToken) => colonyToken?.token.tokenAddress),
    [colonyTokens],
  );

  const hasTokensListChanged = ({
    selectedTokenAddresses,
    tokenAddress,
  }: TokenManagementDialogFormValues) =>
    !!tokenAddress ||
    !isEqual(
      [AddressZero, ...colonyTokenAddresses].sort(),
      selectedTokenAddresses?.sort(),
    );

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const canEditTokens = !!(user?.name && hasRoot(allUserRoles));
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canEditTokens,
    false, // isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  const allTokens = useMemo(() => {
    return [...colonyTokens, ...(canEditTokens ? tokensList : [])]
      .map((token) => token?.token)
      .filter(
        (firstToken, index, mergedTokens) =>
          mergedTokens.findIndex(
            (secondToken) =>
              secondToken?.tokenAddress === firstToken?.tokenAddress,
          ) === index,
      );
  }, [colonyTokens, tokensList, canEditTokens]);

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
            {/* {canEditTokens && isVotingExtensionEnabled (
              <Toggle
                label={{ id: 'label.force' }}
                name="forceAction"
                disabled={isSubmitting}
              />
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
        {allTokens.length > 0 ? (
          <div className={styles.tokenChoiceContainer}>
            {allTokens.map(
              (token) =>
                token && (
                  <TokenItem
                    key={token.tokenAddress}
                    token={token}
                    disabled={
                      inputDisabled ||
                      token.tokenAddress === nativeToken.tokenAddress ||
                      token.tokenAddress === AddressZero
                    }
                  />
                ),
            )}
          </div>
        ) : (
          <Heading4 text={MSG.noTokensText} />
        )}
      </DialogSection>
      <DialogSection>
        <Paragraph className={styles.description}>
          <FormattedMessage {...MSG.notListedToken} />
        </Paragraph>
        <TokenSelector
          label={MSG.fieldLabel}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={inputDisabled}
        />
        <div className={styles.textarea}>
          <Annotations
            label={MSG.textareaLabel}
            name="annotationMessage"
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
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          text={{
            id: back === undefined ? 'button.cancel' : 'button.back',
          }}
          onClick={back === undefined ? close : back}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid || inputDisabled || !hasTokensListChanged(values)}
          type="submit"
          style={{ width: styles.wideButton }}
          data-test="confirm"
        />
      </DialogSection>
    </>
  );
};

TokenEditDialog.displayName = displayName;

export default TokenEditDialog;
