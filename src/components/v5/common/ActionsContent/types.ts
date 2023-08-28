export interface SelectProps {
  name: string;
  selectedWalletAddress?: string;
  isError?: boolean;
}

export type ActionsContentProps = {
  formErrors?: Record<any, any>;
};
