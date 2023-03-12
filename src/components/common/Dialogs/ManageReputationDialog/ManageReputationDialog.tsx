import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';

import {
  WizardDialogType,
  useTransformer,
  useAppContext,
  useEnabledExtensions,
} from '~hooks';

import { getAllUserRoles } from '~redux/transformers';
import { userHasRole } from '~utils/checks';
import { formatText } from '~utils/intl';

const displayName = 'common.ManageReputationDialog';

const MSG = defineMessages({
  dialogHeader: {
    id: `${displayName}.dialogHeader`,
    defaultMessage: 'Manage Reputation',
  },
  awardReputationTitle: {
    id: `${displayName}.awardReputationTitle`,
    defaultMessage: 'Award Reputation',
  },
  awardReputationDescription: {
    id: `${displayName}.awardReputationDescription`,
    defaultMessage: 'Award reputation without making payments.',
  },
  permissionText: {
    id: `${displayName}.permissionsText`,
    defaultMessage: `You must have the {permission} permission in the
      relevant teams, in order to take this action`,
  },
  smiteReputationTitle: {
    id: `${displayName}.smiteReputationTitle`,
    defaultMessage: 'Smite Reputation',
  },
  smiteReputationDescription: {
    id: `${displayName}.smiteReputationDescription`,
    defaultMessage:
      'Punish undesirable behaviour by deducting reputation points.',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepSmiteReputation: string;
  nextStepAwardReputation: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const ManageReputation = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  nextStepSmiteReputation,
  nextStepAwardReputation,
}: Props) => {
  const { wallet, user } = useAppContext();

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const { isVotingReputationEnabled } = useEnabledExtensions(colony);

  const hasRegisteredProfile = !!user?.name && !!wallet?.address;
  const canSmiteReputation =
    hasRegisteredProfile &&
    (userHasRole(allUserRoles, ColonyRole.Arbitration) ||
      isVotingReputationEnabled);

  const canAwardReputation =
    hasRegisteredProfile &&
    (userHasRole(allUserRoles, ColonyRole.Root) || isVotingReputationEnabled);

  const items = [
    {
      title: MSG.awardReputationTitle,
      description: MSG.awardReputationDescription,
      icon: 'emoji-shooting-star',
      permissionRequired: !canAwardReputation,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: formatText({
          id: `role.${ColonyRole.Root}`,
        })?.toLowerCase(),
      },
      onClick: () => callStep(nextStepAwardReputation),
      dataTest: 'awardReputationDialogIndexItem',
    },
    {
      title: MSG.smiteReputationTitle,
      description: MSG.smiteReputationDescription,
      icon: 'emoji-firebolt',
      permissionRequired: !canSmiteReputation,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: formatText({
          id: `role.${ColonyRole.Arbitration}`,
        })?.toLowerCase(),
      },
      onClick: () => callStep(nextStepSmiteReputation),
      dataTest: 'smiteReputationDialogIndexItem',
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

ManageReputation.displayName = displayName;

export default ManageReputation;
