import { StepStage } from './types';

export const iconNameMap: Record<StepStage, string | undefined> = {
  completed: 'check',
  current: undefined,
  upcoming: undefined,
  skipped: undefined,
};
