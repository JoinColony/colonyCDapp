import { defineMessages } from 'react-intl';

const displayName = 'routes.WizardRoute';

export const wizardSidebarMSGs = defineMessages({
  sidebarTitle: {
    id: `${displayName}.sidebarTitle`,
    defaultMessage:
      'Create your new {isCreatingColony, select, true {Colony} other {profile}}',
  },
  account: {
    id: `${displayName}.account`,
    defaultMessage: 'Account',
  },
  profile: {
    id: `${displayName}.profile`,
    defaultMessage: 'Profile',
  },
  create: {
    id: `${displayName}.create`,
    defaultMessage: 'Create',
  },
  details: {
    id: `${displayName}.details`,
    defaultMessage: 'Details',
  },
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native Token',
  },
  confirmation: {
    id: `${displayName}.confirmation`,
    defaultMessage: 'Confirmation',
  },
  complete: {
    id: `${displayName}.complete`,
    defaultMessage: 'Complete',
  },
});

export const wizardSteps = [
  {
    id: -1,
    text: wizardSidebarMSGs.account,
    subItems: [
      {
        id: -1,
        text: wizardSidebarMSGs.profile,
      },
    ],
  },
  {
    id: 0,
    text: wizardSidebarMSGs.create,
    subItems: [
      {
        id: 0,
        text: wizardSidebarMSGs.details,
      },
      {
        id: 1,
        text: wizardSidebarMSGs.nativeToken,
      },
      {
        // @NOTE: This step corresponds to the step where we input the native token info.
        // Due to this step not being present in the UI of the sidebar, we are just including it here for logic purposes.
        id: 2,
      },
      {
        id: 3,
        text: wizardSidebarMSGs.confirmation,
      },
    ],
  },
  {
    id: 4,
    text: wizardSidebarMSGs.complete,
  },
];
