import { StepStage } from './types';

export const STEP_STAGE = {
  Completed: 'completed',
  Current: 'current',
  Upcoming: 'upcoming',
  Skipped: 'skipped',
  Passed: 'passed',
  Failed: 'failed',
} as const;

export const ICON_NAME_MAP: Partial<Record<StepStage, string | undefined>> = {
  [STEP_STAGE.Completed]: 'check',
  [STEP_STAGE.Passed]: 'thumbs-up',
  [STEP_STAGE.Failed]: 'thumbs-down',
};
