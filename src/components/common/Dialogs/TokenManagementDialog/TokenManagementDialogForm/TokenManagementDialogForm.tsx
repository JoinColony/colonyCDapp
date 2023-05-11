import React from 'react';
import { ColonyRole, Id } from '@colony/colony-js';
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
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { useActionDialogStatus } from '~hooks';
import { isEqual } from '~utils/lodash';
import TokenSelector from '~shared/TokenSelector';

import { NoPermissionMessage, PermissionRequiredInfo } from '../../Messages';
import TokenItem from './TokenItem';
import getTokenList from './getTokenList';
import { FormValues } from '../TokenManagementDialog';

import styles from './TokenManagementDialogForm.css';

const displayName = 'common.TokenManagementDialog.TokenManagementDialogForm';

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
    defaultMessage: `Explain why you're making these changes (optional)`,
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

const requiredRoles: ColonyRole[] = [ColonyRole.Root];

const TokenManagementDialogForm = ({
  close,
  colony,
  colony: { tokens, nativeToken },
  back,
  enabledExtensionData,
}: Props) => {
  const { watch } = useFormContext<FormValues>();
  const values = watch();
  const { userHasPermission, disabledInput, disabledSubmit } =
    useActionDialogStatus(
      colony,
      requiredRoles,
      [Id.RootDomain],
      enabledExtensionData,
    );
  const tokenList = getTokenList();
  const colonyTokens = tokens?.items || [];
  const colonyTokenAddresses = colonyTokens.map(
    (colonyToken) => colonyToken?.token.tokenAddress,
  );

  const hasTokensListChanged = ({
    selectedTokenAddresses,
    tokenAddress,
  }: FormValues) =>
    !!tokenAddress ||
    !isEqual([...colonyTokenAddresses].sort(), selectedTokenAddresses?.sort());

  const allTokens = [...colonyTokens, ...(userHasPermission ? tokenList : [])]
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
                      disabledInput ||
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
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Paragraph className={styles.description}>
          <FormattedMessage {...MSG.notListedToken} />
        </Paragraph>
        <TokenSelector
          label={MSG.fieldLabel}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
        />
        <div className={styles.textarea}>
          <Annotations
            label={MSG.textareaLabel}
            name="annotationMessage"
            disabled={disabledInput}
          />
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
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
          disabled={disabledSubmit || !hasTokensListChanged(values)}
          dataTest="confirm"
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

TokenManagementDialogForm.displayName = displayName;

export default TokenManagementDialogForm;
