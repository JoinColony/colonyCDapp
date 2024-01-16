export interface TokensTableProps {
  shouldShowMenu?: (tokenAddress: string) => boolean;
  name: string;
  isRemoved?: boolean;
  isNew?: boolean;
}

export interface TokensTableModel {
  key: string;
}
