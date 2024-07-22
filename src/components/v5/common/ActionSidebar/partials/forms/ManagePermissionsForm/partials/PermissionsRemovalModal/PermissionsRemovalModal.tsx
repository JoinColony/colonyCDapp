import { SpinnerGap, Trash } from '@phosphor-icons/react';
import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import { usePermissionsTableProps } from '~hooks/usePermissionsTableProps.tsx';
import { type PermissionsTableModel } from '~types/permissions.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import Table from '~v5/common/Table/Table.tsx';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import {
  MANAGE_PERMISSIONS_ACTION_FORM_ID,
  UserRoleModifier,
} from '../../consts.ts';
import {
  getFormPermissions,
  getRemovedInheritedPermissions,
} from '../../utils.ts';

import { type PermissionsRemovalModalProps } from './types.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';

const displayName = 'ManagePermissionsForm.partials.PermissionsRemovalModal';

const MSG = defineMessages({
  title: {
    id: 'permissionRemovalModal.title',
    defaultMessage: 'Root permissions removal warning',
  },
  body: {
    id: 'permissionRemovalModal.body1',
    defaultMessage:
      "You are about to remove a member's Root permissions, if no other member or contract holds adequate permissions, there is a risk of losing control of this colony.",
  },
  acknowledge: {
    id: 'permissionRemovalModal.body3',
    defaultMessage: 'I understand the risk and want to remove Root permissions',
  },
});

const PermissionsRemovalModal: React.FC<PermissionsRemovalModalProps> = ({
  isOpen,
  onClose,
  formRole,
  formPermissions,
  isFormSubmitting,
  dbRoleForDomain,
  dbInheritedPermissions,
}) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const permissionsTableProps = usePermissionsTableProps({
    dbRoleForDomain,
    formRole,
    isRemovePermissionsAction: true,
    roles:
      formRole === UserRoleModifier.Remove
        ? dbInheritedPermissions
        : getRemovedInheritedPermissions({
            dbInheritedPermissions,
            formPermissions: getFormPermissions({ formPermissions, formRole }),
          }),
  });

  const handleClose = useCallback(() => {
    onClose();
    setIsAcknowledged(false);
  }, [onClose]);

  useEffect(() => {
    if (isFormSubmitting) {
      handleClose();
    }
  }, [handleClose, isFormSubmitting]);

  return (
    <Modal onClose={handleClose} isOpen={isOpen}>
      <div className="flex flex-col">
        <div className="mb-4 w-fit rounded-md border border-negative-200 p-2">
          <Trash className="fill-negative-400" />
        </div>
        <h1 className="mb-2 text-xl font-bold">{formatText(MSG.title)}</h1>
        <p className="mb-6 text-md">{formatText(MSG.body)}</p>
        <Table<PermissionsTableModel>
          {...permissionsTableProps}
          className="mb-4"
        />
        <Checkbox
          name="acknowledge"
          isChecked={isAcknowledged}
          onChange={() => setIsAcknowledged((state) => !state)}
          classNames="mb-8"
          disabled={isFormSubmitting}
        >
          <p className="text-md">{formatText(MSG.acknowledge)}</p>
        </Checkbox>
        <div className="flex gap-2">
          <Button
            mode="primaryOutline"
            text="Cancel"
            onClick={handleClose}
            isFullSize
            disabled={isFormSubmitting}
          />
          {isFormSubmitting ? (
            <IconButton
              rounded="s"
              isFullSize
              text={{ id: 'button.pending' }}
              icon={
                <span className="ml-2 flex shrink-0">
                  <SpinnerGap size={18} className="animate-spin" />
                </span>
              }
              className="!px-4 !text-md"
            />
          ) : (
            <Button
              mode="secondarySolid"
              text={{ id: 'button.changePermissions' }}
              form={MANAGE_PERMISSIONS_ACTION_FORM_ID}
              isFullSize
              type="submit"
              disabled={!isAcknowledged}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

PermissionsRemovalModal.displayName = displayName;

export default PermissionsRemovalModal;
