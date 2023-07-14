import { WhitelistedUser } from '~common/Dialogs/ManageWhitelistDialog/WhitelistedAddresses/helpers';

export interface TableProps {
  list: WhitelistedUser[];
  onReputationSortClick: () => void;
}
