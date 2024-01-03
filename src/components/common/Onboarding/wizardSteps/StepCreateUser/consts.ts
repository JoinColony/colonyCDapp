import { StepType } from '~shared/Wizard/withWizard';

import StepRedirect from '../StepRedirect';

import StepCreateUser from './StepCreateUser';

export const stepsCreateUser: StepType[] = [StepCreateUser, StepRedirect];
