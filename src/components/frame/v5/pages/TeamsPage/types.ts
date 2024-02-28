import { type ModelSortDirection } from '~gql';

export enum TeamsPageFiltersField {
  FUNDS = 'balanceValue',
  REPUTATION = 'reputation',
}

export type TeamsPageFilters = {
  field: TeamsPageFiltersField;
  direction: ModelSortDirection;
};
