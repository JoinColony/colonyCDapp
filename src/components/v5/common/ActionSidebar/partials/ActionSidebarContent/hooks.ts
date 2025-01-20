import { useFormContext } from 'react-hook-form';

import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';
import { uniqBy } from '~utils/lodash.ts';
import { REPUTATION_VALIDATION_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

export const useGetFormActionErrors = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const allFlatFormErrors = useFlatFormErrors(errors).filter(
    ({ key }) =>
      !['this', REPUTATION_VALIDATION_FIELD_NAME].includes(String(key)),
  );

  const flatFormErrors = uniqBy(allFlatFormErrors, 'message');

  return {
    flatFormErrors,
  };
};
