import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { getBlockscoutUserURL } from '~constants';
import { Colony } from '~types';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import Button from '~shared/Button';
// import { useDialog } from '~shared/Dialog';
// import { BanUserDialog } from '~shared/Comment';
import ExternalLink from '~shared/ExternalLink';
// import ManageWhitelistDialog from '~dashboard/Dialogs/ManageWhitelistDialog';

import styles from './MemberActionsPopover.css';

const displayName = 'MembersList.Actions.MemberActionsPopover';

const MSG = defineMessages({
  addToAddressBook: {
    id: `${displayName}.addToAddressBook`,
    defaultMessage: `Add to address book`,
  },
  banUser: {
    id: `${displayName}.banUser`,
    defaultMessage: `{unban, select,
      true {Unban}
      other {Ban}
    } user`,
  },
  viewOnBlockscout: {
    id: `${displayName}.viewOnBlockscout`,
    defaultMessage: 'View on Blockscout',
  },
});

interface Props {
  closePopover: () => void;
  colony: Colony;
  userAddress: string;
  isWhitelisted: boolean;
  isBanned: boolean;
  canAdministerComments?: boolean;
}

const MemberActionsPopover = ({
  closePopover,
  canAdministerComments,
  // colony,
  userAddress,
  isWhitelisted,
  isBanned,
}: Props) => {
  // const openBanUserDialog = useDialog(BanUserDialog);

  // const handleBanUser = useCallback(
  //   () =>
  //     openBanUserDialog({
  //       colonyAddress: colony.colonyAddress,
  //       isBanning: !isBanned,
  //       addressToBan: userAddress,
  //     }),
  //   [openBanUserDialog, colony, userAddress, isBanned],
  // );
  const handleBanUser = () => console.log('Ban user dialog');

  // const openManageWhitelistDialog = useDialog(ManageWhitelistDialog);
  // const handleManageWhitelist = useCallback(
  //   () => openManageWhitelistDialog({ userAddress, colony }),
  //   [openManageWhitelistDialog, userAddress, colony],
  // );
  const handleManageWhitelist = () => console.log('Whitelist dialog');

  const renderUserActions = () => (
    <DropdownMenuItem>
      <Button appearance={{ theme: 'no-style' }}>
        <ExternalLink
          href={getBlockscoutUserURL(userAddress)}
          className={styles.actionButton}
          text={MSG.viewOnBlockscout}
        />
      </Button>
    </DropdownMenuItem>
  );

  const renderModeratorOptions = () => {
    return (
      <>
        {!isWhitelisted && (
          <DropdownMenuItem>
            <Button
              appearance={{ theme: 'no-style' }}
              onClick={() => handleManageWhitelist()}
            >
              <div className={styles.actionButton}>
                <FormattedMessage {...MSG.addToAddressBook} />
              </div>
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Button
            appearance={{ theme: 'no-style' }}
            onClick={() => handleBanUser()}
          >
            <div className={styles.actionButton}>
              <FormattedMessage {...MSG.banUser} values={{ unban: isBanned }} />
            </div>
          </Button>
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <DropdownMenu onClick={closePopover}>
      <DropdownMenuSection>
        {canAdministerComments && renderModeratorOptions()}
        {renderUserActions()}
      </DropdownMenuSection>
    </DropdownMenu>
  );
};

MemberActionsPopover.displayName = displayName;

export default MemberActionsPopover;
