import { WhitelistedUser } from '~common/Dialogs/ManageWhitelistDialog/WhitelistedAddresses/helpers';

export interface TableItemProps {
  member: WhitelistedUser;
  onDeleteClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
