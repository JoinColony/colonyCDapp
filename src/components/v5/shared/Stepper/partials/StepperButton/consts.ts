export enum StepStage {
  Completed = 'completed',
  Current = 'current',
  Upcoming = 'upcoming',
  Skipped = 'skipped',
}

export const ICON_NAME_MAP: Partial<Record<StepStage, string | undefined>> = {
  [StepStage.Completed]: 'check-mark',
};
