import { StepType } from '~shared/Wizard/withWizard';
import StepCreateUser from './StepCreateUser';
import StepRedirect from '../StepRedirect';

export const stepsCreateUser: StepType[] = [StepCreateUser, StepRedirect];
