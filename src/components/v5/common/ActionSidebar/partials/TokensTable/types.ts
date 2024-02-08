export interface TokensTableProps {
  shouldShowMenu?: (tokenAddress: string) => boolean;
  name: string;
  isDisabled?: boolean;
}

export interface TokensTableModel {
  key: string;
}
