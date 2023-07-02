import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';

import Button from '~shared/Button';
import { SimpleMessageValues } from '~types/index';
import { useAppContext, useColonyContext, useEnabledExtensions } from '~hooks';

import { getUserRolesForDomain } from '~transformers';
import { useDialog } from '~shared/Dialog';
import {
  MintTokenDialog,
  TokenManagementDialog,
  TransferFundsDialog,
} from '~common/Dialogs';
import { userHasRole } from '~utils/checks';

import styles from './ColonyFundingMenu.css';

const displayName = 'common.ColonyFundingMenu';

const MSG = defineMessages({
  navItemMoveTokens: {
    id: `${displayName}.navItemMoveTokens`,
    defaultMessage: 'Move funds',
  },
  navItemMintNewTokens: {
    id: `${displayName}.navItemMintNewTokens`,
    defaultMessage: 'Mint tokens',
  },
  navItemManageTokens: {
    id: `${displayName}.navItemManageTokens`,
    defaultMessage: 'Manage tokens',
  },
});

interface FundingItemProps {
  text: SimpleMessageValues;
  handleClick: () => void;
  disabled: boolean;
}

const FundingItem = ({ text, handleClick, disabled }: FundingItemProps) => (
  <li>
    <Button
      text={text}
      appearance={{ theme: 'blue' }}
      onClick={handleClick}
      disabled={disabled}
    />
  </li>
);

interface ColonyFundingMenuProps {
  filteredDomainId: number;
}

const ColonyFundingMenu = ({ filteredDomainId }: ColonyFundingMenuProps) => {
  const { colony, canInteractWithColony, isSupportedColonyVersion } =
    useColonyContext();
  const { user } = useAppContext();

  const enabledExtensionData = useEnabledExtensions();

  const openTokenManagementDialog = useDialog(TokenManagementDialog);
  const openMintTokenDialog = useDialog(MintTokenDialog);
  const openTransferFundsDialog = useDialog(TransferFundsDialog);

  if (!colony) {
    return null;
  }

  const rootRoles = getUserRolesForDomain(
    colony,
    user?.walletAddress ?? '',
    Id.RootDomain,
  );

  const handleManageTokens = () =>
    openTokenManagementDialog({
      colony,
      enabledExtensionData,
    });

  const handleMintTokens = () =>
    openMintTokenDialog({
      colony,
      enabledExtensionData,
    });

  const handleTransferFunds = () => {
    openTransferFundsDialog({
      colony,
      enabledExtensionData,
      filteredDomainId,
    });
  };

  const { isVotingReputationEnabled } = enabledExtensionData;

  // const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
  //   ({ details, extensionId: extensionName }) =>
  //     details?.initialized &&
  //     !details?.missingPermissions.length &&
  //     extensionName === Extension.OneTxPayment,
  // );
  // const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  const canEdit =
    isVotingReputationEnabled || userHasRole(rootRoles, ColonyRole.Root);
  const canMoveTokens =
    isVotingReputationEnabled || userHasRole(rootRoles, ColonyRole.Funding);
  const canUserMintNativeToken = isVotingReputationEnabled
    ? colony.status?.nativeToken?.mintable
    : userHasRole(rootRoles, ColonyRole.Root) &&
      colony.status?.nativeToken?.mintable;

  return (
    <ul className={styles.main}>
      <FundingItem
        text={MSG.navItemMoveTokens}
        handleClick={handleTransferFunds}
        disabled={
          !canInteractWithColony || !isSupportedColonyVersion || !canMoveTokens
        }
      />
      <FundingItem
        text={MSG.navItemMintNewTokens}
        handleClick={handleMintTokens}
        disabled={
          !canInteractWithColony ||
          !isSupportedColonyVersion ||
          !canUserMintNativeToken
        }
      />
      <FundingItem
        text={MSG.navItemManageTokens}
        handleClick={handleManageTokens}
        disabled={
          !canInteractWithColony || !isSupportedColonyVersion || !canEdit
        }
      />
    </ul>
  );
};

ColonyFundingMenu.displayName = displayName;

export default ColonyFundingMenu;
