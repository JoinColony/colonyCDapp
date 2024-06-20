import { CopySimple, Ticket } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useMobile } from '~hooks';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { CREATE_COLONY_ROUTE_BASE } from '~routes/index.ts';
import Button from '~v5/shared/Button/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/index.ts';

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
  const isMobile = useMobile();
  const invitationCode = user?.privateBetaInviteCode?.id;
  const inviteLink = useBaseUrl(
    `${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`,
  );
  const invitesCount = user?.privateBetaInviteCode?.shareableInvites ?? 0;

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  return (
    <div className="mt-6">
      <CardWithCallout
        icon={Ticket}
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
            icon={isCopied ? undefined : CopySimple}
            onClick={() => handleClipboardCopy(inviteLink)}
            textValues={{ isCopied }}
            size="small"
            isFullSize={isMobile}
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
