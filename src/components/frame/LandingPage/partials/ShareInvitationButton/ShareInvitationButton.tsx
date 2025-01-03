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
}

const ShareInvitationButton = ({
  onCreateColony,
}: ShareInvitationButtonProps) => (
  <div className="hidden md:block">
    <Button
      icon={Plus}
      isFullSize
      className="mt-[1.875rem] md:mb-[3.125rem] md:max-w-[27.5rem]"
      onClick={onCreateColony}
    >
      {formatText(MSG.createColonyButton)}
    </Button>
  </div>
);

ShareInvitationButton.displayName = displayName;

export default ShareInvitationButton;
