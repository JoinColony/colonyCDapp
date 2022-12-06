import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

// import Popover from '~shared/Popover';
import { ThreeDotsButton } from '~shared/Button';

import { Colony } from '~gql';
import { useMobile } from '~hooks';

// import MemberActionsPopover from './MemberActionsPopover';

const MSG = defineMessages({
  memberActionsTitle: {
    id: 'shared.MemberList.MemberActions.MemberActionTitle',
    defaultMessage: 'Member Actions',
  },
});

interface Props {
  userAddress: string;
  colony: Colony;
  isWhitelisted: boolean;
  isBanned: boolean;
  canAdministerComments?: boolean;
}

const displayName = 'shared.MemberList.MemberActions';

const MemberActions = ({
  canAdministerComments,
  colony,
  userAddress,
  isWhitelisted,
  isBanned,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const isMobile = useMobile();
  const offset = isMobile ? [0, 0] : [40, 15];

  return (
    // <Popover
    //   content={({ close }) => (
    //     <MemberActionsPopover
    //       closePopover={close}
    //       canAdministerComments={canAdministerComments}
    //       colony={colony}
    //       isWhitelisted={isWhitelisted}
    //       isBanned={isBanned}
    //       userAddress={userAddress}
    //     />
    //   )}
    //   trigger="click"
    //   showArrow={false}
    //   placement="right"
    //   isOpen={isOpen}
    //   onClose={() => setOpen(false)}
    //   popperOptions={{
    //     modifiers: [
    //       {
    //         name: 'offset',
    //         options: {
    //           offset,
    //         },
    //       },
    //     ],
    //   }}
    // >
    //   {({ ref, id }) => (
    <ThreeDotsButton
      // id={id}
      // innerRef={ref}
      isOpen={isOpen}
      onClick={() => setOpen(true)}
      title={MSG.memberActionsTitle}
    />
    //   )}
    // </Popover>
  );
};

MemberActions.displayName = displayName;

export default MemberActions;
