import withWizard from '~shared/Wizard/withWizard';
import { User } from '~types';

import {
  colonySidebarValues,
  completeSideBarValue,
  userInitialValues,
  userSidebarValues,
  WizardProps,
} from './consts';
import { Flow, WizardType } from './types';
import {
  initialValues as colonyInitialValues,
  stepArray as stepsCreateColony,
} from './wizardSteps/CreateColony/CreateColonyWizard';
import { stepsCreateUser } from './wizardSteps/StepCreateUser/consts';
import WizardTemplate from './WizardTemplate';

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
