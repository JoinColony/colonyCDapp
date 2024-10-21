import { type TokenTypes } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/types.ts';
import {
  type ModelSortDirection,
  type StreamingPaymentEndCondition,
} from '~gql';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';

export interface StreamingPaymentFilters {
  statuses?: StreamingPaymentStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  tokenTypes?: TokenTypes;
  endConditions?: StreamingPaymentEndCondition[];
  totalStreamedFilters?: ModelSortDirection | undefined;
}

export interface DateOptions {
  pastHour: boolean;
  pastDay: boolean;
  pastWeek: boolean;
  pastMonth: boolean;
  pastYear: boolean;
  custom?: [string, string];
}
