import { defineMessages } from 'react-intl';

export const displayName = 'common.Onboarding';

const wizardSidebarMSGs = defineMessages({
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

export const completeSideBarValue = [
  {
    text: wizardSidebarMSGs.complete,
  },
];

export const userSidebarValues = [
  {
    text: wizardSidebarMSGs.account,
    subItems: [
      {
        text: wizardSidebarMSGs.profile,
      },
    ],
  },
];

export const colonySidebarValues = [
  {
    text: wizardSidebarMSGs.create,
    subItems: [
      {
        text: wizardSidebarMSGs.details,
      },
      {
        text: wizardSidebarMSGs.nativeToken,
      },
      {
        // @NOTE: This step corresponds to the step where we input the native token info.
        // Due to this step not being present in the UI of the sidebar, we are just including it here for logic purposes.
      },
      {
        text: wizardSidebarMSGs.confirmation,
      },
    ],
  },
];

export const userInitialValues = {
  username: '',
  emailAddress: '',
};

export interface WizardProps {
  inviteCode?: string;
}
