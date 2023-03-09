import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
// import { ColonyVersion } from '@colony/colony-js';

import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';

import {
  WizardDialogType,
  useTransformer,
  useAppContext,
  useEnabledExtensions,
} from '~hooks';

import { getAllUserRoles } from '~redux/transformers';
import { canEnterRecoveryMode, hasRoot, canArchitect } from '~utils/checks';

const displayName = 'common.AdvancedDialog';

const MSG = defineMessages({
  dialogHeader: {
    id: `${displayName}.dialogHeader`,
    defaultMessage: 'Advanced',
  },
  permissionsText: {
    id: `${displayName}.permissionsText`,
    defaultMessage: `You must have the {permissionsList} permissions in the
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
  upgradePermissionsList: {
    id: `${displayName}.upgradePermissionsList`,
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
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepPermissionManagement: string;
  nextStepRecovery: string;
  nextStepEditDetails: string;
  nextStepVersionUpgrade: string;
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
  colony,
}: // colony: { version: colonyVersion },
Props) => {
  const { user } = useAppContext();

  const hasRegisteredProfile = !!user?.name && !!user.walletAddress;

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    user?.walletAddress,
  ]);
  const hasRootPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  const canEnterRecovery =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);
  // const isSupportedColonyVersion =
  //   parseInt(colonyVersion, 10) > ColonyVersion.LightweightSpaceship;

  const canEnterPermissionManagement =
    (hasRegisteredProfile && canArchitect(allUserRoles)) || hasRootPermission;

  const {
    enabledExtensions: { isVotingReputationEnabled },
  } = useEnabledExtensions();

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
        permissionsList: (
          <FormattedMessage {...MSG.managePermissionsPermissionList} />
        ),
      },
      dataTest: 'managePermissionsDialogIndexItem',
    },
    {
      title: MSG.recoveryTitle,
      description: true // isSupportedColonyVersion
        ? MSG.recoveryDescription
        : MSG.recoveryPreventDescription,
      icon: 'emoji-alarm-lamp',
      onClick: () => callStep(nextStepRecovery),
      permissionRequired: !canEnterRecovery,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.recoveryPermissionsList} />,
      },
      // disabled: !isSupportedColonyVersion,
      dataTest: 'recoveryDialogIndexItem',
    },
    {
      title: MSG.upgradeTitle,
      description: MSG.upgradeDescription,
      icon: 'emoji-strong-person',
      permissionRequired: !(hasRootPermission || isVotingReputationEnabled),
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.upgradePermissionsList} />,
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
        permissionsList: <FormattedMessage {...MSG.upgradePermissionsList} />,
      },
      onClick: () => callStep(nextStepEditDetails),
      dataTest: 'updateColonyDialogIndexItem',
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
