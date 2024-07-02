import { type TokenStatus } from '~v5/common/types.ts';

export interface TokensTableProps {
  shouldShowMenu?: (status: TokenStatus) => boolean;
  name: string;
  isDisabled?: boolean;
}

export interface TokensTableModel {
  key: string;
}
