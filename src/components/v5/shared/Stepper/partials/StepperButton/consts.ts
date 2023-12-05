import { StepStage } from './types';

export enum STEP_STAGE {
  Completed = 'completed',
  Current = 'current',
  Upcoming = 'upcoming',
  Skipped = 'skipped',
}

export const ICON_NAME_MAP: Partial<Record<StepStage, string | undefined>> = {
  [STEP_STAGE.Completed]: 'check-mark',
};
