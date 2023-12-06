import { useFormContext } from 'react-hook-form';

import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';

import { REPUTATION_VALIDATION_FIELD_NAME } from '../../hooks/useReputationValidation.ts';

export const useGetFormActionErrors = () => {
  const { formState } = useFormContext();
  const hasErrors = !formState.isValid && formState.isSubmitted;
  const flatFormErrors = useFlatFormErrors(formState.errors).filter(
    ({ key }) =>
      !['this', REPUTATION_VALIDATION_FIELD_NAME].includes(String(key)),
  );

  return {
    hasErrors,
    flatFormErrors,
  };
};
