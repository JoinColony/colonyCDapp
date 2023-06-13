import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import Popover from '~shared/Popover';
import { ThreeDotsButton } from '~shared/Button';

import { useMobile } from '~hooks';

import MemberActionsPopover from './MemberActionsPopover';

const displayName = 'MemberList.Actions.MemberActions';

const MSG = defineMessages({
  memberActionsTitle: {
    id: `${displayName}.memberActionsTitle`,
    defaultMessage: 'Member Actions',
  },
});

interface Props {
  userAddress: string;
}

const MemberActions = ({ userAddress }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const isMobile = useMobile();
  const offset = isMobile ? [0, 0] : [40, 15];

  return (
    <Popover
      renderContent={({ close }) => (
        <MemberActionsPopover closePopover={close} userAddress={userAddress} />
      )}
      trigger="click"
      showArrow={false}
      placement="right"
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset,
            },
          },
        ],
      }}
    >
      {({ ref, id }) => (
        <ThreeDotsButton
          id={id}
          innerRef={ref}
          isOpen={isOpen}
          onClick={() => setOpen(true)}
          title={MSG.memberActionsTitle}
        />
      )}
    </Popover>
  );
};

MemberActions.displayName = displayName;

export default MemberActions;
