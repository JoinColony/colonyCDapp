import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';

import { Heading3, Heading4 } from '~shared/Heading';
import Button from '~v5/shared/Button';
import Modal from '~v5/shared/Modal';

const displayName = 'v5.common.Modals.InviteMembersModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MSG = defineMessages({
  modalTitle: {
    id: `${displayName}.modalTitle`,
    defaultMessage: 'Invite members to the private beta',
  },
  modalDescription: {
    id: `${displayName}.modalDescription`,
    defaultMessage:
      'You can invite up to 100 members to your Colony during the private beta using the invite link below.',
  },
  invitesUsed: {
    id: `${displayName}.invitesUsed`,
    defaultMessage: '{invitesUsed}/{invitesAvailable} invites used',
  },
  inviteLinkHeading: {
    id: `${displayName}.inviteLinkHeading`,
    defaultMessage: 'Your unique invite link:',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: 'Copy link',
  },
});

// @TODO: Add logic to get the real amount of invites available and used.
const invitesAvailable = 100;
const invitesUsed = 0;

const InviteMembersModal = ({ isOpen, onClose }: Props) => {
  const { colony } = useColonyContext();
  const inviteLink = `app.colony.io/${colony?.name}/invite`;

  const { handleClipboardCopy } = useCopyToClipboard(inviteLink, 5000);

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className="mt-10 flex flex-col items-center">
        <Heading3
          appearance={{ theme: 'dark' }}
          className="text-gray-900 font-semibold"
          text={MSG.modalTitle}
        />
        <p className="mt-1 text-center text-md text-gray-600">
          <FormattedMessage {...MSG.modalDescription} />
        </p>
      </div>
      <div className="flex flex-col items-start px-6 py-4 mt-4 border border-gray-900 rounded">
        <span className="rounded-lg bg-gray-100 text-sm font-medium text-gray-900 p-2 mb-2">
          <FormattedMessage
            {...MSG.invitesUsed}
            values={{ invitesAvailable, invitesUsed }}
          />
        </span>
        <div className="flex justify-between items-center w-full">
          <div>
            <Heading4
              className="text-gray-900 font-medium text-md"
              text={MSG.inviteLinkHeading}
            />
            <p className="text-sm text-gray-600 mt-1">{inviteLink}</p>
          </div>
          <Button
            text={MSG.buttonText}
            mode="primaryOutline"
            iconName="copy-simple"
            onClick={handleClipboardCopy}
            className="text-sm"
          />
        </div>
      </div>
    </Modal>
  );
};

InviteMembersModal.displayName = displayName;

export default InviteMembersModal;
