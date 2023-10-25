import React from 'react';

import Modal from '~v5/shared/Modal';

const displayName = 'v5.common.Modals.InviteMembersModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const InviteMembersModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      Test
    </Modal>
  );
};

InviteMembersModal.displayName = displayName;

export default InviteMembersModal;
