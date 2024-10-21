import { WarningCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/Modal.tsx';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

const displayName = 'v5.common.CompletedAction.partials.ExitEditModeModal';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Are you sure you wish to exit edit mode?',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'You will be returned to the original motion version and all changes will be lost.',
  },
  confirmMessage: {
    id: `${displayName}.confirmMessage`,
    defaultMessage: 'Yes, confirm exit',
  },
  cancelMessage: {
    id: `${displayName}.cancelMessage`,
    defaultMessage: 'Return to edit mode',
  },
});

const ExitEditModeModal: FC<ModalProps> = ({ isOpen, onClose, ...rest }) => {
  const { setIsEditMode } = useActionSidebarContext();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      confirmMessage={formatText(MSG.confirmMessage)}
      closeMessage={formatText(MSG.cancelMessage)}
      shouldShowHeader
      onConfirm={() => {
        setIsEditMode(false);
        onClose();
      }}
      buttonMode="primarySolid"
      icon={WarningCircle}
      {...rest}
    >
      <h4 className="mb-1.5 heading-5">{formatText(MSG.title)}</h4>
      <p className="text-md text-gray-600">{formatText(MSG.description)}</p>
    </Modal>
  );
};

ExitEditModeModal.displayName = displayName;

export default ExitEditModeModal;
