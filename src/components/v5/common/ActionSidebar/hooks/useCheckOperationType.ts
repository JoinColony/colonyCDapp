import { useWatch } from 'react-hook-form';

import { isNil } from '~utils/lodash.ts';

import { type ManageEntityOperation } from '../consts.ts';

export const useCheckOperationType = (
  name: string,
  operationType: ManageEntityOperation,
): boolean | null => {
  const operation = useWatch({ name });

  if (isNil(operation)) {
    return null;
  }

  return operation === operationType;
};
