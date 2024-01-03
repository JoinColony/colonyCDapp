import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import Select from '~v5/common/Fields/Select';
import { SelectOption } from '~v5/common/Fields/Select/types';
import Switch from '~v5/common/Fields/Switch';
import Textarea from '~v5/common/Fields/Textarea';
import Button from '~v5/shared/Button';
import MembersSelect from '~v5/shared/MembersSelect';
import Modal from '~v5/shared/Modal';

import { manageMemberActions } from './consts';
import { ManageMemberModalProps } from './types';

const displayName = 'v5.common.Modals.ManageMemberModal';

// @TODO: add form and logic to handle actions

const ManageMemberModal: FC<ManageMemberModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { formatMessage } = useIntl();
  const [selectedAction, setSelectedAction] = useState<SelectOption['value']>();

  const isBanOptionSelected =
    selectedAction && manageMemberActions[selectedAction]?.value === 'ban';

  const isUnbanOptionSelected =
    selectedAction && manageMemberActions[selectedAction]?.value === 'unban';

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedAction(undefined);
      }}
      icon="folder-user"
    >
      <h4 className="heading-5 mb-1.5">
        {formatMessage({ id: 'members.modal.title' })}
      </h4>
      <p className="text-md text-gray-600 mb-6">
        {formatMessage({ id: 'members.modal.description' })}
      </p>
      <span className="text-1 block mb-1">
        {formatMessage({ id: 'members.modal.member' })}
      </span>
      <div className="mb-4">
        <MembersSelect defaultValue={user?.walletAddress} />
      </div>
      <Select
        onChange={(value) => setSelectedAction(value?.value)}
        value={selectedAction}
        defaultValue={selectedAction}
        options={manageMemberActions}
        placeholder={formatText({ id: 'members.modal.selectActions' })}
      />

      {(isBanOptionSelected || isUnbanOptionSelected) && (
        <>
          <div className="border border-gray-300 bg-base-bg rounded p-4 text-gray-600 text-sm mt-4">
            <span className="font-medium">
              {formatMessage({ id: 'note' })}:{' '}
            </span>{' '}
            <span>
              {formatMessage({
                id: isBanOptionSelected
                  ? 'members.ban.info'
                  : 'members.unban.info',
              })}
            </span>
          </div>

          <div className="text-gray-700 text-1 flex justify-between my-4">
            <div className="flex items-center gap-2">
              {formatMessage({
                id: isBanOptionSelected
                  ? 'members.ban.notify'
                  : 'members.unban.notify',
              })}
              <Tooltip
                tooltipContent={
                  <span>{formatMessage({ id: 'members.ban.tooltip' })}</span>
                }
              >
                <span className="text-gray-400 flex">
                  <Icon name="info" appearance={{ size: 'extraTiny' }} />
                </span>
              </Tooltip>
            </div>
            <Switch id="ban" />
          </div>

          <Textarea textareaTitle={{ id: 'members.ban.textarea.label' }} />

          <div className="flex flex-col-reverse gap-3 mt-8 sm:flex-row">
            <Button mode="primaryOutline" isFullSize>
              {formatMessage({ id: 'button.cancel' })}
            </Button>
            <Button mode="primarySolid" isFullSize>
              {formatMessage({ id: 'button.confirm.action' })}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

ManageMemberModal.displayName = displayName;

export default ManageMemberModal;
