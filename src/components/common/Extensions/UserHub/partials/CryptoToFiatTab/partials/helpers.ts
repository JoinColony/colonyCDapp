import { mapPayload, pipe } from '~utils/actions.ts';

export const getTransferTransformFn = ({
  userAddress,
}: {
  userAddress: string;
}) =>
  pipe(
    mapPayload(({ amount }) => {
      return {
        userAddress,
        amount,
        // @TODO: Uncomment this when saga is ready
        // } as CryptoToFiatTransferActionPayload;
      } as unknown;
    }),
  );

export const getConvertedAmount = (amount: number, conversionRate: number) => {
  return amount * conversionRate;
};

export const getUnconvertedAmount = (
  amount: number,
  conversionRate: number,
) => {
  return amount / conversionRate;
};
