import { CopySimple } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { getRequestInvitesLink } from '~constants/externalUrls.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/index.ts';
import Link from '~v5/shared/Link/Link.tsx';

const displayName = 'v5.common.Modals.InviteMembersModal.partials.ModalContent';

interface Props {
  isOutOfInvites: boolean;
  invitesAvailable: number;
}

const MSG = defineMessages({
  modalTitle: {
    id: `${displayName}.modalTitle`,
    defaultMessage: 'Invite people to this colony',
  },
  modalDescription: {
    id: `${displayName}.modalDescription`,
    defaultMessage:
      'You can invite {invitesAvailable} more people to join and follow this colony during early access. If you run out, you will be able to request more.',
  },
  modalDescriptionReached: {
    id: `${displayName}.modalDescriptionReached`,
    defaultMessage:
      'You have reached your invite limit during early access. If you need more, please make a request.',
  },
  invitesUsed: {
    id: `${displayName}.invitesUsed`,
    defaultMessage:
      '{invitesAvailable} {invitesAvailable, plural, one {invite} other {invites}} remaining',
  },
  inviteLinkHeading: {
    id: `${displayName}.inviteLinkHeading`,
    defaultMessage: 'Unique colony invite link:',
  },
  limitReached: {
    id: `${displayName}.limitReached`,
    defaultMessage: 'Invite limit reached',
  },
  requestInvites: {
    id: `${displayName}.requestInvites`,
    defaultMessage: 'Request invites',
  },
  requestMoreInvites: {
    id: `${displayName}.requestMoreInvites`,
    defaultMessage: 'Request more invites for your colony',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: `{isCopied, select,
      true {Link copied}
      other {Copy link}
    }`,
  },
});

export const ModalContent: FC<Props> = ({
  isOutOfInvites,
  invitesAvailable,
}) => {
  const {
    colony: { colonyMemberInvite, name: colonyName },
  } = useColonyContext();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const inviteLink = useBaseUrl(
    `/invite/${colonyName}/${colonyMemberInvite?.id}`,
  );
  const commonClassName = 'rounded-lg p-2 text-sm font-medium';

  if (isOutOfInvites) {
    return (
      <CardWithCallout
        title={
          <span
            className={clsx(
              commonClassName,
              'bg-negative-100 text-negative-400',
            )}
          >
            <FormattedMessage
              {...MSG.invitesUsed}
              values={{ invitesAvailable }}
            />
          </span>
        }
        subtitle={<FormattedMessage {...MSG.limitReached} />}
        button={
          <Link
            to={getRequestInvitesLink(colonyName)}
            target="_blank"
            className="flex min-h-8.5 items-center justify-center gap-2 whitespace-nowrap 
              rounded-lg border border-gray-900 bg-base-white px-2.5 py-1.5 text-sm font-medium text-gray-900 
              transition-all duration-normal disabled:border-gray-300 disabled:text-gray-300 md:hover:border-gray-900 
              md:hover:bg-gray-900 md:hover:!text-base-white"
          >
            {formatText(MSG.requestInvites)}
          </Link>
        }
      >
        <FormattedMessage {...MSG.requestMoreInvites} />
      </CardWithCallout>
    );
  }

  return (
    <CardWithCallout
      title={
        <span className={clsx(commonClassName, 'bg-blue-100 text-blue-400')}>
          <FormattedMessage
            {...MSG.invitesUsed}
            values={{ invitesAvailable }}
          />
        </span>
      }
      subtitle={<FormattedMessage {...MSG.inviteLinkHeading} />}
      button={
        <Button
          text={MSG.buttonText}
          mode={isCopied ? 'completed' : 'quinary'}
          icon={isCopied ? undefined : CopySimple}
          onClick={() => handleClipboardCopy(inviteLink)}
          size="small"
          textValues={{ isCopied }}
        />
      }
    >
      {inviteLink}
    </CardWithCallout>
  );
};
