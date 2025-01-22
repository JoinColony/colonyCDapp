import { SmileySticker } from '@phosphor-icons/react';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { Heading3 } from '~shared/Heading/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { ModalContent } from './partials/ModalContent.tsx';

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
      'You can invite {invitesAvailable} more {invitesAvailable, plural, one {person} other {people}} to join and follow this colony during early access. If you run out, you will be able to request more.',
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
    colony: { colonyMemberInvite },
  } = useColonyContext();
  const invitesAvailable = colonyMemberInvite?.invitesRemaining || 0;
  const isOutOfInvites = invitesAvailable === 0;

  const getModalSubtitle = () => {
    if (isOutOfInvites) {
      <FormattedMessage
        {...MSG.modalDescriptionReached}
        values={{ invitesAvailable }}
      />;
    }

    return (
      <FormattedMessage
        {...MSG.modalDescription}
        values={{ invitesAvailable }}
      />
    );
  };

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
          {getModalSubtitle()}
        </p>
      </div>
      <ModalContent
        isOutOfInvites={isOutOfInvites}
        invitesAvailable={invitesAvailable}
      />
    </Modal>
  );
};

InviteMembersModal.displayName = displayName;

export default InviteMembersModal;
