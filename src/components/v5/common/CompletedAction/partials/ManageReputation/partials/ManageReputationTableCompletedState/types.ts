export interface ManageReputationTableCompletedStateProps {
  amount: string;
  recipientAddress: string | null | undefined;
  domainId: number | undefined;
  rootHash: string;
  isSmite?: boolean;
  className?: string;
}
