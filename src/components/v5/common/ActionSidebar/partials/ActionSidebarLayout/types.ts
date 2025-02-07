export interface ActionSidebarLayoutProps {
  onCloseClick: () => void;
  additionalTopContent?: React.ReactNode;
  statusPill?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  transactionId?: string;
  isMotion: boolean;
  actionNotFound?: boolean;
  goBackButton?: React.ReactNode;
  transactionHash: string | null;
}
