import { FolderUser, Info } from '@phosphor-icons/react';
import React, { type FC, useState } from 'react';
import { useIntl } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import Select from '~v5/common/Fields/Select/index.ts';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';
import Textarea from '~v5/common/Fields/Textarea/index.ts';
import Button from '~v5/shared/Button/index.ts';
import MembersSelect from '~v5/shared/MembersSelect/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { manageMemberActions } from './consts.ts';
import { type ManageMemberModalProps } from './types.ts';

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
      icon={FolderUser}
    >
      <h4 className="mb-1.5 heading-5">
        {formatMessage({ id: 'members.modal.title' })}
      </h4>
      <p className="mb-6 text-md text-gray-600">
        {formatMessage({ id: 'members.modal.description' })}
      </p>
      <span className="mb-1 block text-1">
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
          <div className="mt-4 rounded border border-gray-300 bg-base-bg p-4 text-sm text-gray-600">
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

          <div className="my-4 flex justify-between text-gray-700 text-1">
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
                <span className="flex text-gray-400">
                  <Info size={12} />
                </span>
              </Tooltip>
            </div>
            <Switch id="ban" />
          </div>

          <Textarea textareaTitle={{ id: 'members.ban.textarea.label' }} />

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
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
