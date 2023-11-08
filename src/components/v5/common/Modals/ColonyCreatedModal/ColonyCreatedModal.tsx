import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Modal from '~v5/shared/Modal';

const displayName = 'v5.common.Modals.ColonyCreatedModal';

const MSG = defineMessages({
  modalTitle: {
    id: `${displayName}.modalTitle`,
    defaultMessage: 'Congratulations!',
  },
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ColonyCreatedModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormattedMessage {...MSG.modalTitle} />
    </Modal>
  );
};

ColonyCreatedModal.displayName = displayName;

export default ColonyCreatedModal;
