export interface SelectProps {
  name: string;
  selectedWalletAddress?: string;
  isErrors: boolean;
}

export type ActionsContentProps = {
  formErrors?: Record<any, any>;
};
