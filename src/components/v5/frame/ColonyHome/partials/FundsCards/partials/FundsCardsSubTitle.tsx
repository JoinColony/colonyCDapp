import React, { type FC } from 'react';

interface FundsCardsSubTitleProps {
  value: React.ReactNode;
  currency: string;
}
export const FundsCardsSubTitle: FC<FundsCardsSubTitleProps> = ({
  value,
  currency,
}) => {
  return (
    <p className="flex items-center gap-2">
      <span>{value}</span>
      <span className="uppercase text-1">{currency}</span>
    </p>
  );
};
