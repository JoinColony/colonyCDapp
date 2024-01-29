import { type StepType } from '~shared/Wizard/withWizard.tsx';

import StepRedirect from '../StepRedirect/index.ts';

import StepCreateUser from './StepCreateUser.tsx';

export const stepsCreateUser: StepType[] = [StepCreateUser, StepRedirect];
