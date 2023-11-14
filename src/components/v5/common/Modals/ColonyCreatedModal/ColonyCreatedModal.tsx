import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import InvitationBlock from '~common/InvitationBlock';
import Icon from '~shared/Icon';
import Button from '~v5/shared/Button';

import Modal from '~v5/shared/Modal';

const displayName = 'v5.common.Modals.ColonyCreatedModal';

const MSG = defineMessages({
  modalTitle: {
    id: `${displayName}.modalTitle`,
    defaultMessage: 'Congratulations!',
  },
  modalDescription: {
    id: `${displayName}.modalDescription`,
    defaultMessage: `Your Colony has been created and is ready for you to jump right in. Grow your Colony by inviting your friends and collaborators to join.`,
  },
  modalButton: {
    id: `${displayName}.modalButton`,
    defaultMessage: 'Explore your Colony',
  },
  modalSubtitle: {
    id: `${displayName}.modalSubtitle`,
    defaultMessage: 'Invite a person to create a Colony',
  },
  modalSubtitleDescription: {
    id: `${displayName}.modalSubtitleDescription`,
    defaultMessage: `You can invite 1 member to create a Colony and test out the new features during the private beta.`,
  },
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ColonyCreatedModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isFullOnMobile={false}>
      <div className="md:mt-10 flex flex-col items-center pb-6 md:pb-8 border-b border-b-gray-200 mb-6 md:mb-8">
        <Icon
          className="mb-3 [&>svg]:fill-gray-900"
          name="confetti"
          appearance={{ size: 'large' }}
        />
        <h3 className="heading-3 mb-2">
          <FormattedMessage {...MSG.modalTitle} />
        </h3>
        <p className="text-gray-600 text-sm mb-6 text-center">
          <FormattedMessage {...MSG.modalDescription} />
        </p>
        <Button mode="primarySolid" text={MSG.modalButton} onClick={onClose} />
      </div>
      <div className="flex flex-col items-center md:mb-4">
        <h4 className="heading-5 mb-2">
          <FormattedMessage {...MSG.modalSubtitle} />
        </h4>
        <p className="text-gray-600 text-sm text-center">
          <FormattedMessage {...MSG.modalSubtitleDescription} />
        </p>
        <InvitationBlock showDescription={false} />
      </div>
    </Modal>
  );
};

ColonyCreatedModal.displayName = displayName;

export default ColonyCreatedModal;
