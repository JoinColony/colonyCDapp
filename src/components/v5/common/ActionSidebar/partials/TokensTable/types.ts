export interface TokensTableProps {
  shouldShowMenu?: (tokenAddress: string) => boolean;
  name: string;
}

export interface TokensTableModel {
  key: string;
}
