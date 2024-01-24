import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useAppContext } from '~context/AppContext';
import useBaseUrl from '~hooks/useBaseUrl';
import useCopyToClipboard from '~hooks/useCopyToClipboard';
import { CREATE_COLONY_ROUTE_BASE } from '~routes';
import Button from '~v5/shared/Button';
import CardWithCallout from '~v5/shared/CardWithCallout';

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
    defaultMessage: `Invite {count} {count, plural,
        =1 {person}
        other {people}
      } to create a Colony`,
  },
});

const InvitationBlock = () => {
  const { user } = useAppContext();
  const invitationCode = user?.privateBetaInviteCode?.id;
  const inviteLink = useBaseUrl(
    `${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`,
  );
  const invitesCount = user?.privateBetaInviteCode?.shareableInvites ?? 0;

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  return (
    <div className="mt-6">
      <CardWithCallout
        iconName="ticket"
        subtitle={
          <FormattedMessage
            {...MSG.inviteBlockTitle}
            values={{ count: invitesCount }}
          />
        }
        button={
          <Button
            text={MSG.buttonText}
            mode={isCopied ? 'completed' : 'quinary'}
            iconName={isCopied ? undefined : 'copy-simple'}
            onClick={() => handleClipboardCopy(inviteLink)}
            textValues={{ isCopied }}
            size="small"
          />
        }
      >
        {inviteLink}
      </CardWithCallout>
    </div>
  );
};

InvitationBlock.displayName = displayName;

export default InvitationBlock;
