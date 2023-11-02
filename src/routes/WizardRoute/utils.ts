import { defineMessages } from 'react-intl';

const displayName = 'routes.WizardRoute';

export const wizardSidebarMSGs = defineMessages({
  sidebarTitle: {
    id: `${displayName}.sidebarTitle`,
    defaultMessage: 'Create your new Colony',
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
    itemStep: -1,
    itemText: wizardSidebarMSGs.account,
    subItems: [
      {
        itemStep: -1,
        itemText: wizardSidebarMSGs.profile,
      },
    ],
  },
  {
    itemStep: 0,
    itemText: wizardSidebarMSGs.create,
    subItems: [
      {
        itemStep: 0,
        itemText: wizardSidebarMSGs.details,
      },
      {
        itemStep: 1,
        itemText: wizardSidebarMSGs.nativeToken,
      },
      {
        itemStep: 2,
      },
      {
        itemStep: 3,
        itemText: wizardSidebarMSGs.confirmation,
      },
    ],
  },
  {
    itemStep: 4,
    itemText: wizardSidebarMSGs.complete,
  },
];
