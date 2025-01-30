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

  const orderMap = new Map<string, number>(
    inputsOrder.map((fieldName, index) => [fieldName, index]),
  );

  const sortedFlatFormErrors = flatFormErrors.sort((a, b) => {
    const aIndex = orderMap.get(a.key.toString()) ?? Infinity;
    const bIndex = orderMap.get(b.key.toString()) ?? Infinity;

    return aIndex - bIndex;
  });
  return {
    flatFormErrors: sortedFlatFormErrors,
  };
};
