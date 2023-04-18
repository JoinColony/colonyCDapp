import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~shared/Dialog';
import IndexModal from '~shared/IndexModal';

import { WizardDialogType, useTransformer, useAppContext } from '~hooks';
import { getAllUserRoles } from '~redux/transformers';
import { canArchitect, hasRoot } from '~utils/checks';

const displayName = 'common.ManageDomainsDialog';

const MSG = defineMessages({
  dialogHeader: {
    id: `${displayName}.dialogHeader`,
    defaultMessage: 'Manage teams',
  },
  createNewDomainTitle: {
    id: `${displayName}.createNewDomainTitle`,
    defaultMessage: 'Create new team',
  },
  createNewDomainDescription: {
    id: `${displayName}.createNewDomainDescription`,
    defaultMessage: 'Domains, departments, circles: teams let you group types of activity.',
  },
  editDomainTitle: {
    id: `${displayName}.editDomainTitle`,
    defaultMessage: 'Edit team',
  },
  editDomainDescription: {
    id: `${displayName}.editDomainDescription`,
    defaultMessage: `Need to repurpose a team? Here's the place to do it.`,
  },
  domainPermissionsList: {
    id: `${displayName}.domainPermissionsList`,
    defaultMessage: 'administration',
  },
  manageWhitelistTitle: {
    id: `${displayName}.manageWhitelistTitle`,
    defaultMessage: 'Manage address book',
  },
  manageWhitelistDescription: {
    id: `${displayName}.manageWhitelistDescription`,
    defaultMessage: 'Add addresses you trust to your colony’s address book',
  },
  permissionsText: {
    id: `${displayName}.permissionsText`,
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant teams, in order to take this action`,
  },
  manageWhitelistPermissionsList: {
    id: `${displayName}.manageWhitelistPermissionsList`,
    defaultMessage: 'root',
  },
});

interface CustomWizardDialogueProps extends ActionDialogProps {
  nextStep: string;
  nextStepEdit: string;
  nextStepManageWhitelist: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogueProps;

const ManageDomainsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  nextStep,
  nextStepEdit,
  nextStepManageWhitelist,
  colony,
  enabledExtensionData,
}: Props) => {
  const { wallet, user } = useAppContext();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, wallet?.address]);
  const hasRegisteredProfile = !!user?.name && !!wallet?.address;
  const hasRootPermission = hasRegisteredProfile && hasRoot(allUserRoles);
  const canCreateEditDomain = hasRegisteredProfile && canArchitect(allUserRoles);

  const { isVotingReputationEnabled } = enabledExtensionData;

  const items = [
    {
      title: MSG.createNewDomainTitle,
      description: MSG.createNewDomainDescription,
      icon: 'emoji-crane',
      permissionRequired: !(canCreateEditDomain || isVotingReputationEnabled),
      permissionInfoTextValues: {
        permissionRequired: <FormattedMessage {...MSG.domainPermissionsList} />,
      },
      onClick: () => callStep(nextStep),
      dataTest: 'createDomainDialogIndexItem',
    },
    {
      title: MSG.editDomainTitle,
      description: MSG.editDomainDescription,
      icon: 'emoji-pencil-note',
      permissionRequired: !(canCreateEditDomain || isVotingReputationEnabled),
      permissionInfoTextValues: {
        permissionRequired: <FormattedMessage {...MSG.domainPermissionsList} />,
      },
      onClick: () => callStep(nextStepEdit),
      dataTest: 'editDomainDialogIndexItem',
    },

    {
      title: MSG.manageWhitelistTitle,
      description: MSG.manageWhitelistDescription,
      icon: 'emoji-whitelist',
      permissionRequired: !hasRootPermission,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.manageWhitelistPermissionsList} />,
      },
      onClick: () => callStep(nextStepManageWhitelist),
    },
  ];

  return (
    <IndexModal title={MSG.dialogHeader} cancel={cancel} close={close} items={items} back={() => callStep(prevStep)} />
  );
};

ManageDomainsDialog.displayName = displayName;

export default ManageDomainsDialog;
