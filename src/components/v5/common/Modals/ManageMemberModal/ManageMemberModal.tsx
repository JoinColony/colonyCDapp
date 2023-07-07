import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import Modal from '~v5/shared/Modal';
import MembersSelect from '~v5/shared/MembersSelect';
import Select from '~v5/common/Fields/Select';
import { manageMemberActions } from './consts';
import { ManageMemberModalProps } from './types';

const displayName = 'v5.Modals.ManageMemberModal';

const ManageMemberModal: FC<ManageMemberModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { formatMessage } = useIntl();
  const [selectedAction, setSelectedAction] = useState<number | undefined>(
    undefined,
  );

  const handleChange = (selectedOption: number | undefined) => {
    setSelectedAction(selectedOption);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} icon="folder-user">
      <h4 className="heading-5 mb-[0.375rem]">
        {formatMessage({ id: 'members.modal.title' })}
      </h4>
      <p className="text-md text-gray-600 mb-6">
        {formatMessage({ id: 'members.modal.description' })}
      </p>
      <span className="text-1 block mb-1">
        {formatMessage({ id: 'members.modal.member' })}
      </span>
      <div className="mb-4">
        <MembersSelect user={user} />
      </div>
      <Select
        handleChange={handleChange}
        selectedElement={selectedAction}
        list={manageMemberActions}
        placeholderText={{ id: 'members.modal.selectActions' }}
        isListRelative
      />
    </Modal>
  );
};

ManageMemberModal.displayName = displayName;

export default ManageMemberModal;
