import withWizard from '~shared/Wizard/withWizard.tsx';
import { type User } from '~types/graphql.ts';

import {
  colonySidebarValues,
  completeSideBarValue,
  userInitialValues,
  userSidebarValues,
  type WizardProps,
} from './consts.ts';
import { type Flow, WizardType } from './types.ts';
import {
  initialValues as colonyInitialValues,
  stepArray as stepsCreateColony,
} from './wizardSteps/CreateColony/CreateColonyWizard.ts';
import { stepsCreateUser } from './wizardSteps/StepCreateUser/consts.ts';
import WizardTemplate from './WizardTemplate.tsx';

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
