import { useFormContext } from 'react-hook-form';

import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';
import { uniqBy } from '~utils/lodash.ts';
import { REPUTATION_VALIDATION_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import { useInputsOrderContext } from './InputsOrderContext/InputsOrderContext.ts';

export const useGetFormActionErrors = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const allFlatFormErrors = useFlatFormErrors(errors).filter(
    ({ key }) =>
      !['this', REPUTATION_VALIDATION_FIELD_NAME].includes(String(key)),
  );

  const flatFormErrors = uniqBy(allFlatFormErrors, 'message');

  const { inputsOrder } = useInputsOrderContext();

  const sortedFlatFormErrors = flatFormErrors.sort((a, b) => {
    const aIndex = inputsOrder.findIndex((fieldName) => a.key === fieldName);
    const bIndex = inputsOrder.findIndex((fieldName) => b.key === fieldName);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
  return {
    flatFormErrors: sortedFlatFormErrors,
  };
};
