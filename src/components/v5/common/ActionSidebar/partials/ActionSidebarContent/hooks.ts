import { useFormContext } from 'react-hook-form';

import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';

import { REPUTATION_VALIDATION_FIELD_NAME } from '../../hooks/useReputationValidation.ts';

export const useGetFormActionErrors = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const flatFormErrors = useFlatFormErrors(errors).filter(
    ({ key }) =>
      !['this', REPUTATION_VALIDATION_FIELD_NAME].includes(String(key)),
  );

  return {
    flatFormErrors,
  };
};
