import { useMemo } from 'react';

import {
  useGetExpenditureQuery,
  useOnExpenditureUpdateSubscription,
} from '~gql';

export const useGetExpenditureData = (
  expenditureId: string | null | undefined,
) => {
  const { data, loading, refetch } = useGetExpenditureQuery({
    variables: {
      expenditureId: expenditureId || '',
    },
    skip: !expenditureId,
  });

  const expenditure = data?.getExpenditure;

  const { data: updatedData, loading: loadingSubscription } =
    useOnExpenditureUpdateSubscription();

  const updatedExpenditure = updatedData?.onUpdateExpenditure;

  const finalExpenditure = useMemo(
    () => updatedExpenditure ?? expenditure,
    [expenditure, updatedExpenditure],
  );

  return {
    expenditure: finalExpenditure,
    loadingExpenditure: loading ?? loadingSubscription,
    refetchExpenditure: refetch,
  };
};
