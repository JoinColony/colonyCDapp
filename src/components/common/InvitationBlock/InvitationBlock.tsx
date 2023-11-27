import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useAppContext, useBaseUrl, useClipboardCopy } from '~hooks';
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
  const { user } = useAppContext();
  const invitationCode = user?.privateBetaInviteCode?.id;
  const inviteLink = useBaseUrl(
    `${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`,
  );

  const { handleClipboardCopy, isCopied } = useClipboardCopy(inviteLink);

  return (
    <div className="mt-6">
      <CardWithCallout
        iconName="ticket"
        subtitle={<FormattedMessage {...MSG.inviteBlockTitle} />}
        button={
          <Button
            text={MSG.buttonText}
            mode={isCopied ? 'completed' : 'quinary'}
            iconName={isCopied ? undefined : 'copy-simple'}
            onClick={() => handleClipboardCopy()}
            textValues={{ isCopied }}
            size="small"
          />
        }
      >
        <FormattedMessage
          {...MSG.inviteBlockDescription}
          values={{ inviteLink, showDescription }}
        />
      </CardWithCallout>
    </div>
  );
};

InvitationBlock.displayName = displayName;

export default InvitationBlock;
