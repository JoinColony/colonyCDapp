import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { getBlockscoutUserURL } from '~constants';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import Button from '~shared/Button';
import ExternalLink from '~shared/ExternalLink';

import styles from './MemberActionsPopover.css';
import { isUserVerified } from '~utils/verifiedUsers';
import { useDialog } from '~shared/Dialog';
import { ManageWhitelistDialog } from '~common/Dialogs';
import { useColonyContext, useEnabledExtensions } from '~hooks';

const displayName = 'MembersList.Actions.MemberActionsPopover';

const MSG = defineMessages({
  viewOnBlockscout: {
    id: `${displayName}.viewOnBlockscout`,
    defaultMessage: 'View on Blockscout',
  },
  addToAddressBook: {
    id: `${displayName}.addToAddressBook`,
    defaultMessage: `Add to address book`,
  },
});

interface Props {
  closePopover: () => void;
  userAddress: string;
}

const MemberActionsPopover = ({ closePopover, userAddress }: Props) => {
  const { colony } = useColonyContext();

  const isWhitelisted = isUserVerified(
    userAddress,
    colony?.metadata?.whitelistedAddresses ?? [],
  );
  const enabledExtensionData = useEnabledExtensions();

  const openManageWhitelistDialog = useDialog(ManageWhitelistDialog);

  if (!colony) {
    return null;
  }

  const handleManageWhitelist = () => {
    openManageWhitelistDialog({
      userAddress,
      colony,
      enabledExtensionData,
    });
  };

  return (
    <DropdownMenu onClick={closePopover}>
      <DropdownMenuSection>
        <DropdownMenuItem>
          <Button appearance={{ theme: 'no-style' }}>
            <ExternalLink
              href={getBlockscoutUserURL(userAddress)}
              className={styles.actionButton}
              text={MSG.viewOnBlockscout}
            />
          </Button>
        </DropdownMenuItem>
        {!isWhitelisted && (
          <DropdownMenuItem>
            <Button
              appearance={{ theme: 'no-style' }}
              onClick={handleManageWhitelist}
            >
              <div className={styles.actionButton}>
                <FormattedMessage {...MSG.addToAddressBook} />
              </div>
            </Button>
          </DropdownMenuItem>
        )}
      </DropdownMenuSection>
    </DropdownMenu>
  );
};

MemberActionsPopover.displayName = displayName;

export default MemberActionsPopover;
