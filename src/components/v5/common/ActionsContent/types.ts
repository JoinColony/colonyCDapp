export interface SelectProps {
  name: string;
  selectedWalletAddress?: string;
  isError?: boolean;
  isAddressVerified?: boolean;
  isUserVerified?: boolean;
}

export type ActionsContentProps = {
  formErrors?: Record<any, any>;
};
