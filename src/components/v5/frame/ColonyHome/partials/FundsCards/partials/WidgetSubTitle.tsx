import React, { type FC } from 'react';

interface WidgetSubTitleProps {
  amount: number;
  currency: string;
  currencySymbol: string;
}
export const WidgetSubTitle: FC<WidgetSubTitleProps> = ({
  amount,
  currency,
  currencySymbol,
}) => {
  return (
    <div className="flex items-center">
      <b>
        {currencySymbol} {amount}
      </b>
      <span className="ml-1 text-md font-medium uppercase">{currency}</span>
    </div>
  );
};
