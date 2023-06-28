import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';
import { getAllUserRoles } from '~transformers';
import { hasRoot } from '~utils/checks';
import { useTransformer, WizardDialogType, useAppContext } from '~hooks';

const displayName = 'common.ManageSafeDialog';

const MSG = defineMessages({
  dialogHeader: {
    id: `${displayName}.dialogHeader`,
    defaultMessage: 'Safe (multi-sig) Control',
  },
  addExistingSafeTitle: {
    id: `${displayName}.addExistingSafeTitle`,
    defaultMessage: 'Add Existing Safe',
  },
  addExistingSafeDescription: {
    id: `${displayName}.addExistingSafeDescription`,
    defaultMessage:
      'Add an existing Safe that you would like your Colony to control.',
  },
  removeSafeTitle: {
    id: `${displayName}.removeSafeTitle`,
    defaultMessage: 'Remove Safe',
  },
  removeSafeDescription: {
    id: `${displayName}.removeSafeDescription`,
    defaultMessage: 'Remove a Safe you previously added to your Colony.',
  },
  controlSafeTitle: {
    id: `${displayName}.controlSafeTitle`,
    defaultMessage: 'Control Safe',
  },
  controlSafeDescription: {
    id: `${displayName}.controlSafeDescription`,
    defaultMessage: 'Get your colony’s Safe to do stuff.',
  },
  permissionText: {
    id: `${displayName}.permissionsText`,
    defaultMessage: `You must have the {permission} permission in the
      relevant teams, in order to take this action`,
  },
  manageSafePermission: {
    id: `${displayName}.manageSafePermission`,
    defaultMessage: 'root',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepAddExistingSafe: string;
  nextStepRemoveSafe: string;
  nextStepControlSafe: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const ManageSafeDialog = ({
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  nextStepAddExistingSafe,
  nextStepRemoveSafe,
  nextStepControlSafe,
  enabledExtensionData: { isVotingReputationEnabled },
}: Props) => {
  const { wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const canManageSafes = hasRoot(allUserRoles);
  const canControlSafes = canManageSafes || isVotingReputationEnabled;
  const items = [
    {
      title: MSG.addExistingSafeTitle,
      description: MSG.addExistingSafeDescription,
      icon: 'plus-heavy',
      dataTest: 'addExistingSafeItem',
      onClick: () => callStep(nextStepAddExistingSafe),
      permissionRequired: !canManageSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.manageSafePermission} />,
      },
    },
    {
      title: MSG.removeSafeTitle,
      description: MSG.removeSafeDescription,
      icon: 'trash-can',
      dataTest: 'removeSafeItem',
      onClick: () => callStep(nextStepRemoveSafe),
      permissionRequired: !canManageSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.manageSafePermission} />,
      },
    },
    {
      title: MSG.controlSafeTitle,
      description: MSG.controlSafeDescription,
      icon: 'joystick',
      dataTest: 'controlSafeItem',
      onClick: () => callStep(nextStepControlSafe),
      permissionRequired: !canControlSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.manageSafePermission} />,
      },
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

ManageSafeDialog.displayName = displayName;

export default ManageSafeDialog;
