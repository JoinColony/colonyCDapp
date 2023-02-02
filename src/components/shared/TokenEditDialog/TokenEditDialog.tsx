import React from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages, FormattedMessage } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogHeading,
  DialogSection,
  DialogControls,
} from '~shared/Dialog';
import { Annotations } from '~shared/Fields';
import { Heading4 } from '~shared/Heading';
import Paragraph from '~shared/Paragraph';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import PermissionsLabel from '~shared/PermissionsLabel';
import { TokenSelector } from '~common/CreateColonyWizard';
import { TokenManagementDialogFormValues } from '~common/Dialogs';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import {
  useTransformer,
  useAppContext,
  useDialogActionPermissions,
} from '~hooks';
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';
import { isEqual } from '~utils/lodash';

import TokenItem from './TokenItem';
import getTokenList from './getTokenList';

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
}

const TokenEditDialog = ({
  close,
  colony,
  colony: { tokens, nativeToken },
  back,
}: // isVotingExtensionEnabled,
Props) => {
  const { user, wallet } = useAppContext();
  const {
    getValues,
    formState: { isValid, isSubmitting },
  } = useFormContext();
  const values = getValues();
  const tokenList = getTokenList();
  const colonyTokens = tokens?.items || [];
  const colonyTokenAddresses = colonyTokens.map(
    (colonyToken) => colonyToken?.token.tokenAddress,
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

  const allTokens = [...colonyTokens, ...(canEditTokens ? tokenList : [])]
    .map((token) => token?.token)
    .filter(
      (firstToken, index, mergedTokens) =>
        mergedTokens.findIndex(
          (secondToken) =>
            secondToken?.tokenAddress === firstToken?.tokenAddress,
        ) === index,
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
        <DialogControls
          onSecondaryButtonClick={back === undefined ? close : back}
          secondaryButtonText={{
            id: back === undefined ? 'button.cancel' : 'button.back',
          }}
          disabled={!isValid || inputDisabled || !hasTokensListChanged(values)}
          dataTest="confirm"
        />
      </DialogSection>
    </>
  );
};

TokenEditDialog.displayName = displayName;

export default TokenEditDialog;
