import React from 'react';
import { defineMessages } from 'react-intl';

import { getBlockscoutUserURL } from '~constants';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import Button from '~shared/Button';
import ExternalLink from '~shared/ExternalLink';

import styles from './MemberActionsPopover.css';

const displayName = 'MembersList.Actions.MemberActionsPopover';

const MSG = defineMessages({
  viewOnBlockscout: {
    id: `${displayName}.viewOnBlockscout`,
    defaultMessage: 'View on Blockscout',
  },
});

interface Props {
  closePopover: () => void;
  userAddress: string;
}

const MemberActionsPopover = ({ closePopover, userAddress }: Props) => {
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

  return (
    <DropdownMenu onClick={closePopover}>
      <DropdownMenuSection>{renderUserActions()}</DropdownMenuSection>
    </DropdownMenu>
  );
};

MemberActionsPopover.displayName = displayName;

export default MemberActionsPopover;
