import { type SupportedCurrencies } from '~gql';

export const getFormattedAmount = (
  amount: string | number,
  currency: SupportedCurrencies,
) => {
  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });

  return `${formatter.format(parsedAmount)} ${currency.toUpperCase()}`;
};
