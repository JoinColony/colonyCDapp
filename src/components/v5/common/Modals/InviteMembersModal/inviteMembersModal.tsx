import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Heading3 } from '~shared/Heading';
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
});

const InviteMembersModal = ({ isOpen, onClose }: Props) => {
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
    </Modal>
  );
};

InviteMembersModal.displayName = displayName;

export default InviteMembersModal;
