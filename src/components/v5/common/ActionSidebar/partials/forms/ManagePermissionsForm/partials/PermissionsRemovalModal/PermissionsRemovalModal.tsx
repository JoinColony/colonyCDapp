import { SpinnerGap } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { usePermissionsTableProps } from '~hooks/usePermissionsTableProps.tsx';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import { type PermissionsTableModel } from '~types/permissions.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/Table.tsx';
import Button, { TxButton } from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import {
  MANAGE_PERMISSIONS_ACTION_FORM_ID,
  type ManagePermissionsFormValues,
} from '../../consts.ts';

const displayName = 'ManagePermissionsForm.partials.PermissionsRemovalModal';

const MSG = defineMessages({
  title: {
    id: 'permissionRemovalModal.title',
    defaultMessage: 'Warning',
  },
  body1: {
    id: 'permissionRemovalModal.body1',
    defaultMessage:
      'Member {member} will lose the following permissions from the parent domain:',
  },
  body2: {
    id: 'permissionRemovalModal.body2',
    defaultMessage: 'This action is irreversible.',
  },
  body3: {
    id: 'permissionRemovalModal.body3',
    defaultMessage: 'Are you sure you want to proceed?',
  },
});

const PermissionsRemovalModal = ({
  member,
  isOpen,
  onClose,
  userRoleWrapperForDomain,
  userRolesForDomain,
  activeFormRole,
  isFormSubmitting,
}: {
  member: ManagePermissionsFormValues['member'];
  isOpen: boolean;
  onClose: () => void;
  userRoleWrapperForDomain: ManagePermissionsFormValues['_dbuserRoleWrapperForDomain'];
  userRolesForDomain: ManagePermissionsFormValues['_dbUserRolesForDomain'];
  activeFormRole: ManagePermissionsFormValues['role'];
  isFormSubmitting: boolean;
}) => {
  const { user } = useUserByAddress(member);

  const permissionsTableProps = usePermissionsTableProps({
    userRoleWrapperForDomain,
    userRolesForDomain,
    activeFormRole,
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">{formatText(MSG.title)}</h1>
        <p className="text-md">
          {formatText(MSG.body1, { member: user?.profile?.displayName })}
        </p>
        <Table<PermissionsTableModel> {...permissionsTableProps} />
        <p className="text-md">{formatText(MSG.body2)}</p>
        <p className="text-md">{formatText(MSG.body3)}</p>
        <div className="flex gap-2">
          <Button
            mode="primaryOutline"
            text="Cancel"
            onClick={onClose}
            isFullSize
            disabled={isFormSubmitting}
          />
          {isFormSubmitting ? (
            <TxButton
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
              mode="primarySolid"
              text={{ id: 'button.changePermissions' }}
              form={MANAGE_PERMISSIONS_ACTION_FORM_ID}
              isFullSize
              type="submit"
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

PermissionsRemovalModal.displayName = displayName;

export default PermissionsRemovalModal;
