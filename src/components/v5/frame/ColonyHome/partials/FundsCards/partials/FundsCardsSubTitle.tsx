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
    <div className="flex items-center gap-2 heading-4">
      <b>{value}</b>
      <span className="text-1">{currency}</span>
    </div>
  );
};
