export interface AmountFieldProps {
  name: string;
  tokenAddressFieldName?: string;
  domainId?: number;
  isDisabled?: boolean;
  placeholder?: string;
  isTokenSelectionDisabled?: boolean;
  onBlur?: () => void;
  onChange?: () => void;
  readOnly?: boolean;
}
