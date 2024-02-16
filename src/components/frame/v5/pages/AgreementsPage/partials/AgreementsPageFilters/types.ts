import { type MotionState } from '~utils/colonyMotions.ts';

export interface AgreementsPageFilters {
  motionStates?: MotionState[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface DateOptions {
  pastHour: boolean;
  pastDay: boolean;
  pastWeek: boolean;
  pastMonth: boolean;
  pastYear: boolean;
  custom?: [string, string];
}
