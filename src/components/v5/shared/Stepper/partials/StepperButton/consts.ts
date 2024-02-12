import { Check, type Icon } from '@phosphor-icons/react';

export enum StepStage {
  Completed = 'completed',
  Current = 'current',
  Upcoming = 'upcoming',
  Skipped = 'skipped',
}

export const ICON_NAME_MAP: Partial<Record<StepStage, Icon | undefined>> = {
  [StepStage.Completed]: Check,
};
