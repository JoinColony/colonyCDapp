import { CopySimple, SmileySticker } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { Heading3 } from '~shared/Heading/index.ts';
import Button from '~v5/shared/Button/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/index.ts';
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
      'Up to 100 people can join to follow and be apart of this colony during early access. If you exceed the limit, you can request more.',
  },
  invitesUsed: {
    id: `${displayName}.invitesUsed`,
    defaultMessage: '{invitesUsed}/{invitesAvailable} invites used',
  },
  inviteLinkHeading: {
    id: `${displayName}.inviteLinkHeading`,
    defaultMessage: 'Unique colony invite link:',
  },
  limitReached: {
    id: `${displayName}.limitReached`,
    defaultMessage: 'Invite limit reached',
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
          <FormattedMessage {...MSG.modalDescription} />
        </p>
      </div>
      <CardWithCallout
        title={
          <span
            className={clsx(
              'rounded-lg bg-gray-100 p-2 text-sm font-medium text-gray-900',
              {
                'bg-negative-100 text-negative-400': isOutOfInvites,
              },
            )}
          >
            <FormattedMessage
              {...MSG.invitesUsed}
              values={{ invitesAvailable, invitesUsed }}
            />
          </span>
        }
        subtitle={
          <FormattedMessage
            {...(isOutOfInvites ? MSG.limitReached : MSG.inviteLinkHeading)}
          />
        }
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
