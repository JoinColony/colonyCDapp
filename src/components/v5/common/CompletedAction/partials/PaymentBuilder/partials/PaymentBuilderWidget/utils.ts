import { ExpenditureStatus } from '~gql';

import { ExpenditureStep } from './types.ts';

// @todo: update steps
export const getExpenditureStep = (status?: ExpenditureStatus) => {
  switch (status) {
    case ExpenditureStatus.Draft:
      return ExpenditureStep.Review;
    case ExpenditureStatus.Locked:
      return ExpenditureStep.Funding;
    default:
      return ExpenditureStep.Create;
  }
};
