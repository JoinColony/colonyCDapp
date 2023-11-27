import { defineMessages } from 'react-intl';

import withWizard from '~shared/Wizard/withWizard';
import { User } from '~types';

import { Flow, WizardType } from './types';
import WizardTemplate from './WizardTemplate';
import {
  initialValues as colonyInitialValues,
  stepArray as stepsCreateColony,
} from './wizardSteps/CreateColony/CreateColonyWizard';
import { stepsCreateUser } from './wizardSteps/StepCreateUser/consts';

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

const userSidebarValues = [
  {
    text: wizardSidebarMSGs.account,
    subItems: [
      {
        text: wizardSidebarMSGs.profile,
      },
    ],
  },
];

const colonySidebarValues = [
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

const completeSideBarValue = [
  {
    text: wizardSidebarMSGs.complete,
  },
];

const userInitialValues = {
  username: '',
  emailAddress: '',
};

export interface WizardProps {
  inviteCode?: string;
}

export const createWizard = (
  user: User | null | undefined,
  flow: Flow,
  inviteCode?: string,
) => {
  if (flow === 'user') {
    return withWizard<WizardProps>({
      initialValues: userInitialValues,
      steps: stepsCreateUser,
      templateProps: {
        sidebarValues: [...userSidebarValues, ...completeSideBarValue],
        wizardType: WizardType.CreateUser,
      },
    })(WizardTemplate);
  }

  if (user && flow === 'colony') {
    return withWizard<WizardProps>({
      initialValues: colonyInitialValues,
      steps: stepsCreateColony,
      templateProps: {
        sidebarValues: [...colonySidebarValues, ...completeSideBarValue],
        wizardType: WizardType.CreateColony,
      },
    })(WizardTemplate);
  }

  return withWizard<WizardProps>({
    initialValues: { ...userInitialValues, ...colonyInitialValues, inviteCode },
    steps: [stepsCreateUser[0], ...stepsCreateColony],
    templateProps: {
      sidebarValues: [
        ...userSidebarValues,
        ...colonySidebarValues,
        ...completeSideBarValue,
      ],
      wizardType: WizardType.CreateUserAndColony,
    },
  })(WizardTemplate);
};
