import { CopySimple, SmileySticker } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { getRequestInvitesLink } from '~constants/externalUrls.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { Heading3 } from '~shared/Heading/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/index.ts';
import Link from '~v5/shared/Link/Link.tsx';
import Modal from '~v5/shared/Modal/index.ts';

const displayName = 'v5.common.Modals.InviteMembersModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
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

const InviteMembersModal = ({ isOpen, onClose }: Props) => {
  const {
    colony: { colonyMemberInvite, name: colonyName },
  } = useColonyContext();

  const invitesAvailable = 100;
  const inviteLink = useBaseUrl(
    `/invite/${colonyName}/${colonyMemberInvite?.id}`,
  );
  const invitesUsed = 100 - (colonyMemberInvite?.invitesRemaining || 0);
  const isOutOfInvites = invitesUsed >= invitesAvailable;

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className="mb-8 mt-10 flex flex-col items-center">
        <SmileySticker size={42} className="mb-3" />
        <Heading3
          appearance={{ theme: 'dark' }}
          className="font-semibold text-gray-900"
          text={MSG.modalTitle}
        />
        <p className="mt-1 text-center text-sm text-gray-600">
          <FormattedMessage
            {...(isOutOfInvites
              ? MSG.modalDescriptionReached
              : MSG.modalDescription)}
            values={{ invitesAvailable }}
          />
        </p>
      </div>
      <CardWithCallout
        title={
          <span
            className={clsx(
              'rounded-lg bg-blue-100 p-2 text-sm font-medium text-blue-400',
              {
                'bg-negative-100 text-negative-400': isOutOfInvites,
              },
            )}
          >
            <FormattedMessage
              {...MSG.invitesUsed}
              values={{ invitesAvailable }}
            />
          </span>
        }
        subtitle={
          <FormattedMessage
            {...(isOutOfInvites ? MSG.limitReached : MSG.inviteLinkHeading)}
          />
        }
        button={
          !isOutOfInvites ? (
            <Button
              text={MSG.buttonText}
              mode={isCopied ? 'completed' : 'quinary'}
              icon={isCopied ? undefined : CopySimple}
              onClick={() => handleClipboardCopy(inviteLink)}
              size="small"
              textValues={{ isCopied }}
            />
          ) : (
            <Link
              to={getRequestInvitesLink(colonyName)}
              target="_blank"
              className="flex min-h-8.5 items-center justify-center gap-2
                whitespace-nowrap rounded-lg border border-gray-900 bg-base-white px-2.5 py-1.5 text-sm font-medium text-gray-900 transition-all duration-normal disabled:border-gray-300 disabled:text-gray-300 md:hover:border-gray-900 md:hover:bg-gray-900 md:hover:!text-base-white"
            >
              {formatText(MSG.requestInvites)}
            </Link>
          )
        }
      >
        {isOutOfInvites ? (
          <FormattedMessage {...MSG.requestMoreInvites} />
        ) : (
          inviteLink
        )}
      </CardWithCallout>
    </Modal>
  );
};

InviteMembersModal.displayName = displayName;

export default InviteMembersModal;
