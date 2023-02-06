import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';

import { WizardDialogType, useTransformer, useAppContext } from '~hooks'; // useEnabledExtensions

import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks'; // canFund

const displayName = 'common.ManageFundsDialog';

const MSG = defineMessages({
  dialogHeader: {
    id: `${displayName}.dialogHeader`,
    defaultMessage: 'Manage Funds',
  },
  transferFundsTitle: {
    id: `${displayName}.transferFundsTitle`,
    defaultMessage: 'Transfer Funds',
  },
  transferFundsDescription: {
    id: `${displayName}.transferFundsDescription`,
    defaultMessage: 'Move funds between teams.',
  },
  permissionsListText: {
    id: `${displayName}.permissionsListText`,
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant teams, in order to take this action`,
  },
  paymentPermissionsList: {
    id: `${displayName}.paymentPermissionsList`,
    defaultMessage: 'funding',
  },
  mintTokensTitle: {
    id: `${displayName}.mintTokensTitle`,
    defaultMessage: 'Mint Tokens',
  },
  mintTokensDescription: {
    id: `${displayName}.mintTokensDescription`,
    defaultMessage: 'Need more tokens? Cook up a batch here.',
  },
  mintTokensPermissionsList: {
    id: `${displayName}.mintTokensPermissionsList`,
    defaultMessage: 'root',
  },
  manageTokensTitle: {
    id: `${displayName}.manageTokensTitle`,
    defaultMessage: 'Manage Tokens',
  },
  manageTokensDescription: {
    id: `${displayName}.manageTokensDescription`,
    defaultMessage: 'Add or remove tokens you want the colony to recognize.',
  },
  manageTokensPermissionsList: {
    id: `${displayName}.manageTokensPermissionsList`,
    defaultMessage: 'root',
  },
  rewardPayoutTitle: {
    id: `${displayName}.rewardPayoutTitle`,
    defaultMessage: 'Start a Reward Payout',
  },
  rewardPayoutDescription: {
    id: `${displayName}.rewardPayoutDescription`,
    defaultMessage:
      "Are there funds in your colony's reward pot? Make it rain!",
  },
  rewardsTitle: {
    id: `${displayName}.rewardsTitle`,
    defaultMessage: 'Set Rewards',
  },
  rewardsDescription: {
    id: `${displayName}.rewardsDescription`,
    defaultMessage: "Set what % of the colony's revenue should go to members.",
  },
  unlockTokensTitle: {
    id: `${displayName}.unlockTokensTitle`,
    defaultMessage: 'Unlock Token',
  },
  unlockTokensDescription: {
    id: `${displayName}.unlockTokensDescription`,
    defaultMessage:
      'Allow your native token to be transferred between accounts.',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepTransferFunds: string;
  nextStepMintTokens: string;
  nextStepManageTokens: string;
  nextStepUnlockToken: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const ManageFundsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  nextStepTransferFunds,
  nextStepMintTokens,
  nextStepManageTokens,
  nextStepUnlockToken,
}: Props) => {
  const { wallet } = useAppContext();

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  // const canMoveFunds = canFund(allUserRoles);
  // const canUserMintNativeToken = isVotingExtensionEnabled
  //   ? colony.status?.nativeToken?.mintable
  //   : hasRoot(allUserRoles) && colony.status?.nativeToken?.mintable;
  // const canUserUnlockNativeToken = isVotingExtensionEnabled
  //   ? colony.status?.nativeToken?.unlockable
  //   : hasRoot(allUserRoles) && colony.status?.nativeToken?.unlockable;

  const canManageTokens = hasRoot(allUserRoles);

  const items = [
    {
      title: MSG.transferFundsTitle,
      description: MSG.transferFundsDescription,
      icon: 'emoji-world-globe',
      permissionRequired: false, // !canMoveFunds || isVotingExtensionEnabled,
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.paymentPermissionsList} />,
      },
      onClick: () => callStep(nextStepTransferFunds),
      dataTest: 'transferFundsDialogIndexItem',
    },
    {
      title: MSG.mintTokensTitle,
      description: MSG.mintTokensDescription,
      icon: 'emoji-seed-sprout',
      permissionRequired: false, // !canUserMintNativeToken,
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: (
          <FormattedMessage {...MSG.mintTokensPermissionsList} />
        ),
      },
      onClick: () => callStep(nextStepMintTokens),
      dataTest: 'mintTokensDialogItem',
    },
    {
      title: MSG.manageTokensTitle,
      description: MSG.manageTokensDescription,
      icon: 'emoji-pen',
      permissionRequired: !canManageTokens, // || isVotingExtensionEnabled
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: (
          <FormattedMessage {...MSG.manageTokensPermissionsList} />
        ),
      },
      onClick: () => callStep(nextStepManageTokens),
      dataTest: 'manageTokensDialogItem',
    },
    {
      title: MSG.rewardPayoutTitle,
      description: MSG.rewardPayoutDescription,
      icon: 'emoji-piggy-bank',
      comingSoon: true,
    },
    {
      title: MSG.rewardsTitle,
      description: MSG.rewardsDescription,
      icon: 'emoji-medal',
      comingSoon: true,
    },
    {
      title: MSG.unlockTokensTitle,
      description: MSG.unlockTokensDescription,
      icon: 'emoji-padlock',
      onClick: () => callStep(nextStepUnlockToken),
      permissionRequired: false, // !canUserUnlockNativeToken,
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: (
          <FormattedMessage {...MSG.manageTokensPermissionsList} />
        ),
      },
      dataTest: 'unlockTokenDialogIndexItem',
    },
  ];
  const filteredItems =
    colony?.status?.nativeToken?.mintable &&
    colony?.status?.nativeToken?.unlockable
      ? items
      : items.filter(({ icon }) => {
          if (
            icon === 'emoji-padlock' &&
            !colony?.status?.nativeToken?.unlockable
          ) {
            return true; // false
          }
          return true; // !(
          //   icon === 'emoji-seed-sprout' &&
          //   !colony.status?.nativeToken?.mintable
          // );
        });
  return (
    <IndexModal
      cancel={cancel}
      close={close}
      title={MSG.dialogHeader}
      items={filteredItems}
      back={() => callStep(prevStep)}
    />
  );
};

ManageFundsDialog.displayName = displayName;

export default ManageFundsDialog;
