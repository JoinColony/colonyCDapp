import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { ManageWhitelistDialog } from '~common/Dialogs';
import { getBlockscoutUserURL } from '~constants';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import Button from '~shared/Button';
import { useDialog } from '~shared/Dialog';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import ExternalLink from '~shared/ExternalLink';

import styles from './MemberActionsPopover.css';

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

  const isWhitelisted = false;
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
