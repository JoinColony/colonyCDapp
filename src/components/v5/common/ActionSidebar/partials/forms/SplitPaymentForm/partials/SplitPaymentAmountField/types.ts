import { type AmountFieldProps } from '~v5/common/ActionSidebar/partials/AmountField/types.ts';

export type SplitPaymentAmountFieldProps = Pick<
  AmountFieldProps,
  'onBlur' | 'name' | 'tokenAddressFieldName' | 'isDisabled'
>;
