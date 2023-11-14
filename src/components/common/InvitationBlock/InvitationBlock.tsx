import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import clsx from 'clsx';
import { Heading4 } from '~shared/Heading';
import Icon from '~shared/Icon';
import Button from '~v5/shared/Button';
import { useClipboardCopy, useInvitationLink } from '~hooks';

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
    /* eslint-disable max-len */
    defaultMessage: `{showDescription, select,
        true {You can invite only one member to create a colony of their own using the new app during the private beta with this custom invite link: }
        other {}
      }{inviteLink}`,
    /* eslint-enable max-len */
  },
});

interface Props {
  showDescription?: boolean;
}

const InvitationBlock = ({ showDescription = true }: Props) => {
  const inviteLink = useInvitationLink();
  const { handleClipboardCopy, isCopied } = useClipboardCopy(inviteLink);

  return (
    <div className="flex flex-col mt-6 rounded border border-gray-900 px-6 py-4 max-w-[1286px]">
      <Icon name="ticket" appearance={{ size: 'medium' }} />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div
          className={clsx({
            'md:max-w-[90%]': showDescription,
            'md:max-w-[70%]': !showDescription,
          })}
        >
          <Heading4
            text={MSG.inviteBlockTitle}
            className="font-medium text-gray-900 mt-2 text-md"
          />
          <p className="text-sm text-gray-600 mt-1">
            <FormattedMessage
              {...MSG.inviteBlockDescription}
              values={{ inviteLink, showDescription }}
            />
          </p>
        </div>
        <Button
          text={MSG.buttonText}
          mode={isCopied ? 'completed' : 'quinary'}
          iconName={isCopied ? undefined : 'copy-simple'}
          onClick={handleClipboardCopy}
          className="text-sm mt-4 md:mt-0"
          textValues={{ isCopied }}
          size="small"
        />
      </div>
    </div>
  );
};

InvitationBlock.displayName = displayName;

export default InvitationBlock;
