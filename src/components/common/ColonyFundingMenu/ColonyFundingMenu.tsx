import React from 'react';
import { defineMessages } from 'react-intl';
// import {
//   ColonyRole,
//   ROOT_DOMAIN_ID,
//   ColonyVersion,
//   Extension,
// } from '@colony/colony-js';

import Button from '~shared/Button';
// import { useDialog } from '~core/Dialog';
// import TransferFundsDialog from '~dialogs/TransferFundsDialog';
// import ColonyTokenManagementDialog from '~dialogs/ColonyTokenManagementDialog';
// import TokenMintDialog from '~dialogs/TokenMintDialog';
// import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';

// import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
// import { useTransformer } from '~utils/hooks';
// import { getUserRolesForDomain } from '~modules/transformers';
// import { userHasRole } from '~modules/users/checks';
// import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';
import { SimpleMessageValues } from '~types/index';
import { useColonyContext } from '~hooks';

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

// interface Props {
// colony: Colony;
// selectedDomainId: number;
// }

const ColonyFundingMenu = () =>
  // {
  // colony: { version, isDeploymentFinished, colonyAddress },
  // colony,
  // selectedDomainId,
  // }: Props
  {
    const { canInteractWithColony } = useColonyContext();

    // const { isVotingExtensionEnabled } = useEnabledExtensions({ colonyAddress });
    // const { data } = useColonyExtensionsQuery({
    //   variables: { address: colonyAddress },
    // });

    // const openTokenManagementDialog = useDialog(ColonyTokenManagementDialog);
    // const openTokenMintDialog = useDialog(TokenMintDialog);
    // const openTokensMoveDialog = useDialog(TransferFundsDialog);

    // const rootRoles = useTransformer(getUserRolesForDomain, [
    //   colony,
    //   walletAddress,
    //   ROOT_DOMAIN_ID,
    // ]);

    // const handleEditTokens = useCallback(
    //   () =>
    //     openTokenManagementDialog({
    //       colony,
    //     }),
    //   [openTokenManagementDialog, colony],
    // );
    // const handleMintTokens = useCallback(() => {
    //   openTokenMintDialog({
    //     colony,
    //   });
    // }, [colony, openTokenMintDialog]);
    // const handleMoveTokens = useCallback(
    //   () =>
    //     openTokensMoveDialog({
    //       colony,
    //       ethDomainId: selectedDomainId,
    //     }),
    //   [colony, openTokensMoveDialog, selectedDomainId],
    // );

    // const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
    //   ({ details, extensionId: extensionName }) =>
    //     details?.initialized &&
    //     !details?.missingPermissions.length &&
    //     extensionName === Extension.OneTxPayment,
    // );
    // const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

    // const canEdit =
    //   isVotingExtensionEnabled || userHasRole(rootRoles, ColonyRole.Root);
    // const canMoveTokens =
    //   isVotingExtensionEnabled || userHasRole(rootRoles, ColonyRole.Funding);
    // const canUserMintNativeToken = isVotingExtensionEnabled
    //   ? colony.canColonyMintNativeToken
    //   : userHasRole(rootRoles, ColonyRole.Root) &&
    //     colony.canColonyMintNativeToken;

    // const isSupportedColonyVersion =
    //   parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;

    /*
     * @TODO All these should be integrated into the colony context / canInteractWithColony
     * and used at a top level
     */
    const isSupportedColonyVersion = true;

    interface FIProps {
      text: SimpleMessageValues;
      handleClick: () => void;
      disabled: boolean;
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    const FundingItem = ({ text, handleClick, disabled }: FIProps) => (
      <li>
        <Button
          text={text}
          appearance={{ theme: 'blue' }}
          onClick={handleClick}
          disabled={
            !canInteractWithColony || !isSupportedColonyVersion || disabled
          }
        />
      </li>
    );

    return (
      <ul className={styles.main}>
        <FundingItem
          text={MSG.navItemMoveTokens}
          handleClick={() => {}}
          // handleClick={handleMoveTokens}
          // disabled={!canMoveTokens}
          disabled
        />
        <FundingItem
          text={MSG.navItemMintNewTokens}
          handleClick={() => {}}
          // handleClick={handleMintTokens}
          // disabled={!canUserMintNativeToken}
          disabled
        />
        <FundingItem
          text={MSG.navItemManageTokens}
          handleClick={() => {}}
          // handleClick={handleEditTokens}
          // disabled={!canEdit}
          disabled
        />
      </ul>
    );
  };

ColonyFundingMenu.displayName = displayName;

export default ColonyFundingMenu;
