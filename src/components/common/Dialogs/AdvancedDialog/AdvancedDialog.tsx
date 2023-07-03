import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';

import {
  WizardDialogType,
  useUserAccountRegistered,
  useAppContext,
} from '~hooks';

import { getAllUserRoles } from '~transformers';
import { canEnterRecoveryMode, hasRoot, canArchitect } from '~utils/checks';

const displayName = 'common.AdvancedDialog';

const MSG = defineMessages({
  dialogHeader: {
    id: `${displayName}.dialogHeader`,
    defaultMessage: 'Advanced',
  },
  permissionsText: {
    id: `${displayName}.permissionsText`,
    defaultMessage: `You must have the {permission} permission in the
      relevant teams, in order to take this action`,
  },
  managePermissionsTitle: {
    id: `${displayName}.managePermissionsTitle`,
    defaultMessage: 'Manage Permissions',
  },
  managePermissionsDescription: {
    id: `${displayName}.managePermissionsDescription`,
    defaultMessage:
      'Set permissions for trusted colony members. Use with caution!',
  },
  managePermissionsPermissionList: {
    id: `${displayName}.managePermissionsPermissionList`,
    defaultMessage: 'architecture',
  },
  recoveryTitle: {
    id: `${displayName}.recoveryTitle`,
    defaultMessage: 'Recovery',
  },
  recoveryDescription: {
    id: `${displayName}.recoveryDescription`,
    defaultMessage: 'Disable your colony in case of emergency.',
  },
  recoveryPreventDescription: {
    id: `${displayName}.recoveryPreventDescription`,
    defaultMessage: 'Please upgrade your colony version to use Recovery Mode.',
  },
  recoveryPermissionsList: {
    id: `${displayName}.recoveryPermissionsList`,
    defaultMessage: 'recovery',
  },
  upgradeTitle: {
    id: `${displayName}.upgradeTitle`,
    defaultMessage: 'Upgrade',
  },
  upgradeDescription: {
    id: `${displayName}.upgradeDescription`,
    defaultMessage:
      'New colony network version available? Get your colony’s swole on here.',
  },
  rootActionsPermission: {
    id: `${displayName}.rootActionsPermission`,
    defaultMessage: 'root',
  },
  editColonyDetailsTitle: {
    id: `${displayName}.editColonyDetailsTitle`,
    defaultMessage: 'Edit colony details',
  },
  editColonyDetailsDescription: {
    id: `${displayName}.editColonyDetailsDescription`,
    defaultMessage: 'Change your colony’s logo and name here.',
  },
  makeArbitraryTransactionTitle: {
    id: `${displayName}.makeArbitraryTransactionTitle`,
    defaultMessage: 'Make arbitrary transaction',
  },
  makeArbitraryTransactionDescription: {
    id: `${displayName}.makeArbitraryTransactionDescription`,
    defaultMessage:
      'Want to interact with DeFi, or govern an external smart contract?',
  },
  manageSafeTitle: {
    id: 'dashboard.AdvancedDialog.manageSafeTitle',
    defaultMessage: 'Safe (multi-sig) Control',
  },
  manageSafeDescription: {
    id: 'dashboard.AdvancedDialog.manageSafeDescription',
    defaultMessage:
      'Control a Safe (multi-sig) on another chain with your colony',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepPermissionManagement: string;
  nextStepRecovery: string;
  nextStepEditDetails: string;
  nextStepVersionUpgrade: string;
  nextStepManageSafe: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const AdvancedDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  nextStepPermissionManagement,
  nextStepRecovery,
  nextStepEditDetails,
  nextStepVersionUpgrade,
  nextStepManageSafe,
  colony,
  enabledExtensionData: { isVotingReputationEnabled },
}: Props) => {
  const { wallet } = useAppContext();

  const userHasAccountRegistered = useUserAccountRegistered();

  const allUserRoles = getAllUserRoles(colony, wallet?.address || '');

  const hasRootPermission = userHasAccountRegistered && hasRoot(allUserRoles);

  const canEnterRecovery =
    userHasAccountRegistered && canEnterRecoveryMode(allUserRoles);
  const isSupportedColonyVersion = colony.version > 5;

  const canEnterPermissionManagement =
    (userHasAccountRegistered && canArchitect(allUserRoles)) ||
    hasRootPermission;

  const items = [
    {
      title: MSG.managePermissionsTitle,
      description: MSG.managePermissionsDescription,
      icon: 'emoji-building',
      onClick: () => callStep(nextStepPermissionManagement),
      permissionRequired: !(
        canEnterPermissionManagement || isVotingReputationEnabled
      ),
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permission: (
          <FormattedMessage {...MSG.managePermissionsPermissionList} />
        ),
      },
      dataTest: 'managePermissionsDialogIndexItem',
    },
    {
      title: MSG.recoveryTitle,
      description: isSupportedColonyVersion
        ? MSG.recoveryDescription
        : MSG.recoveryPreventDescription,
      icon: 'emoji-alarm-lamp',
      onClick: () => callStep(nextStepRecovery),
      permissionRequired: !canEnterRecovery,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.recoveryPermissionsList} />,
      },
      disabled: true, // !isSupportedColonyVersion, @TODO: disabled for now as we don't have the recovery mode implemented
      dataTest: 'recoveryDialogIndexItem',
      comingSoon: true,
    },
    {
      title: MSG.upgradeTitle,
      description: MSG.upgradeDescription,
      icon: 'emoji-strong-person',
      permissionRequired: !(hasRootPermission || isVotingReputationEnabled),
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.rootActionsPermission} />,
      },
      onClick: () => callStep(nextStepVersionUpgrade),
    },
    {
      title: MSG.editColonyDetailsTitle,
      description: MSG.editColonyDetailsDescription,
      icon: 'emoji-edit-tools',
      permissionRequired: !(hasRootPermission || isVotingReputationEnabled),
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.rootActionsPermission} />,
      },
      onClick: () => callStep(nextStepEditDetails),
      dataTest: 'updateColonyDialogIndexItem',
    },
    {
      title: MSG.manageSafeTitle,
      description: MSG.manageSafeDescription,
      icon: 'safe-logo',
      dataTest: 'manageSafeItem',
      onClick: () => callStep(nextStepManageSafe),
      permissionRequired: !(hasRootPermission || isVotingReputationEnabled),
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.rootActionsPermission} />,
      },
    },
    {
      title: MSG.makeArbitraryTransactionTitle,
      description: MSG.makeArbitraryTransactionDescription,
      icon: 'emoji-dna',
      comingSoon: true,
    },
  ];
  return (
    <IndexModal
      cancel={cancel}
      close={close}
      title={MSG.dialogHeader}
      items={items}
      back={() => callStep(prevStep)}
    />
  );
};

AdvancedDialog.displayName = displayName;

export default AdvancedDialog;
