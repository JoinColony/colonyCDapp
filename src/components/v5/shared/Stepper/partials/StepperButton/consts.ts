import { StepStage } from './types';

export const STEP_STAGE = {
  Completed: 'completed',
  Current: 'current',
  Upcoming: 'upcoming',
  Skipped: 'skipped',
} as const;

export const ICON_NAME_MAP: Partial<Record<StepStage, string | undefined>> = {
  [STEP_STAGE.Completed]: 'check',
};
