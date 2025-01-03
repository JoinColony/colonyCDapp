import { Plus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName = 'frame.LandingPage.partials.ShareInvitationButton';

const MSG = defineMessages({
  createColonyButton: {
    id: `${displayName}.createColonyButton`,
    defaultMessage: 'Create new Colony',
  },
});

interface ShareInvitationButtonProps {
  onCreateColony: () => void;
  className?: string;
}

const ShareInvitationButton = ({
  onCreateColony,
  className,
}: ShareInvitationButtonProps) => (
  <div className="hidden md:block">
    <Button
      icon={Plus}
      isFullSize
      className={className}
      onClick={onCreateColony}
    >
      {formatText(MSG.createColonyButton)}
    </Button>
  </div>
);

ShareInvitationButton.displayName = displayName;

export default ShareInvitationButton;
