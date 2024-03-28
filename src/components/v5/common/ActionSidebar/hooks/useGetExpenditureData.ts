import { useGetExpenditureQuery } from '~gql';

export const useGetExpenditureData = (
  expenditureId: string | null | undefined,
) => {
  const { data, loading } = useGetExpenditureQuery({
    variables: {
      expenditureId: expenditureId || '',
    },
    skip: !expenditureId,
  });

  return {
    expenditure: data?.getExpenditure,
    loadingExpenditure: loading,
  };
};
