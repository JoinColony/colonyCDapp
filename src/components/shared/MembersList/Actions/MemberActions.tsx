import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

// import Popover from '~shared/Popover';
import { ThreeDotsButton } from '~shared/Button';
import { Colony } from '~gql';

// import MemberActionsPopover from './MemberActionsPopover';

import queries from '~styles/queries.css';

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
  const isMobile = useMediaQuery({ query: queries.query700 });
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
