import { Confetti } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import InvitationBlock from '~common/InvitationBlock/index.ts';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

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
    defaultMessage: `You can invite {count} {count, plural,
        =1 {person}
        other {people}
      } to create a Colony and test out the new features during the private beta.`,
  },
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shareableInvitesCount: number;
}

const ColonyCreatedModal = ({
  isOpen,
  onClose,
  shareableInvitesCount,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isFullOnMobile={false}>
      <div className="flex flex-col items-center pb-6 md:mt-10 md:pb-8">
        <Confetti className="mb-3 [&>svg]:fill-gray-900" size={42} />
        <h3 className="mb-2 heading-3">
          <FormattedMessage {...MSG.modalTitle} />
        </h3>
        <p className="mb-6 text-center text-sm text-gray-600">
          <FormattedMessage {...MSG.modalDescription} />
        </p>
        <Button mode="primarySolid" text={MSG.modalButton} onClick={onClose} />
      </div>
      {shareableInvitesCount > 0 && (
        <div className="flex flex-col items-center border-t border-t-gray-200 pt-6 md:mb-4 md:pt-8">
          <h4 className="mb-2 heading-5">
            <FormattedMessage {...MSG.modalSubtitle} />
          </h4>
          <p className="text-center text-sm text-gray-600">
            <FormattedMessage
              {...MSG.modalSubtitleDescription}
              values={{ count: shareableInvitesCount }}
            />
          </p>
          <InvitationBlock />
        </div>
      )}
    </Modal>
  );
};

ColonyCreatedModal.displayName = displayName;

export default ColonyCreatedModal;
