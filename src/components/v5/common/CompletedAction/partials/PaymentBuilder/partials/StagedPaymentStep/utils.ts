import { type Expenditure } from '~types/graphql.ts';

export const getMilestoneName = (expenditure: Expenditure, slotId: number) => {
  return (
    expenditure.metadata?.stages?.find((stage) => stage.slotId === slotId)
      ?.name ?? ''
  );
};
