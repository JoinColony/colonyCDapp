import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Heading4 } from '~shared/Heading';
import Icon from '~shared/Icon';
import Button from '~v5/shared/Button';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { useAppContext } from '~hooks';

const displayName = 'common.InvitationBlock';

const MSG = defineMessages({
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: `{isCopied, select,
      true {Link copied}
      other {Copy link}
    }`,
  },
  inviteBlockTitle: {
    id: `${displayName}.inviteBlockTitle`,
    defaultMessage: 'Invite 1 person to create a Colony',
  },
  inviteBlockDescription: {
    id: `${displayName}.inviteBlockDescription`,
    defaultMessage:
      'You can invite only one member to create a colony of their own using the new app during the private beta with this custom invite link: app.colony.io/createcolony/{invitationCode}',
  },
});

const InvitationBlock = () => {
  const { user } = useAppContext();
  const invitationCode = user?.privateBetaInviteCode?.id;
  const inviteLink = `app.colony.io/createcolony/${invitationCode}`;
  const { handleClipboardCopy, isCopied } = useCopyToClipboard(inviteLink);

  return (
    <div className="flex flex-col mt-6 rounded border border-gray-900 px-6 py-4 max-w-[1286px]">
      <Icon name="ticket" appearance={{ size: 'medium' }} />
      <div className="flex justify-between items-center">
        <div className="max-w-[90%]">
          <Heading4
            text={MSG.inviteBlockTitle}
            className="font-medium text-gray-900 mt-2 text-md"
          />
          <p className="text-sm text-gray-600 mt-1">
            <FormattedMessage
              {...MSG.inviteBlockDescription}
              values={{ invitationCode }}
            />
          </p>
        </div>
        <Button
          text={MSG.buttonText}
          mode={isCopied ? 'completed' : 'primaryOutline'}
          iconName={isCopied ? undefined : 'copy-simple'}
          onClick={handleClipboardCopy}
          className="text-sm"
          textValues={{ isCopied }}
        />
      </div>
    </div>
  );
};

InvitationBlock.displayName = displayName;

export default InvitationBlock;
