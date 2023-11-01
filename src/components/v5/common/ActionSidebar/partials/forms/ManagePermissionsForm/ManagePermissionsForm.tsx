import React, { FC, useCallback } from 'react';
import { useManagePermissions } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import UserSelect from '../../UserSelect';
import TeamsSelect from '../../TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { formatText } from '~utils/intl';
import PermissionsTable from './partials/PermissionsTable';
import {
  AUTHORITY_OPTIONS,
  PERMISSIONS_OPTIONS,
  REMOVE_ROLE_OPTION_VALUE,
} from './consts';
import PermissionsModal from './partials/PermissionsModal';
import useToggle from '~hooks/useToggle';
import Icon from '~shared/Icon';
import { CardSelectProps } from '~v5/common/Fields/CardSelect/types';
import { getRoleLabel } from './utils';

const displayName = 'v5.common.ActionSidebar.partials.ManagePermissionsForm';

const ManagePermissionsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { role, isModeRoleSelected } = useManagePermissions(getFormOptions);
  const [
    isPermissionsModalOpen,
    {
      toggleOff: togglePermissionsModalOff,
      toggleOn: togglePermissionsModalOn,
    },
  ] = useToggle();
  const permissionSelectFooter = useCallback<
    Exclude<CardSelectProps<string>['footer'], React.ReactNode>
  >(
    ([, { toggleOff }]) => (
      <button
        type="button"
        className="w-full flex justify-center items-center"
        onClick={() => {
          togglePermissionsModalOn();
          toggleOff();
        }}
      >
        <Icon name="question" appearance={{ size: 'tiny' }} />
        <span className="font-semibold text-sm underline ml-[.375rem]">
          {formatText({
            id: 'actionSidebar.managePermissions.roleSelect.footerCta',
          })}
        </span>
      </button>
    ),
    [togglePermissionsModalOn],
  );

  return (
    <>
      <PermissionsModal
        onClose={togglePermissionsModalOff}
        isOpen={isPermissionsModalOpen}
      />
      <ActionFormRow
        iconName="user-focus"
        fieldName="member"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.managePermissions.member',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.member' })}
      >
        <UserSelect name="member" />
      </ActionFormRow>
      <ActionFormRow
        iconName="users-three"
        fieldName="team"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.managePermissions.team',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.managePermissions.team' })}
      >
        <TeamsSelect name="team" />
      </ActionFormRow>
      <ActionFormRow
        iconName="shield"
        fieldName="role"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.permissions',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.permissions' })}
      >
        <FormCardSelect
          name="role"
          cardClassName="max-w-[calc(100vw-2.5rem)] md:max-w-sm"
          renderSelectedValue={(option, placeholder) =>
            getRoleLabel(option?.value) || placeholder
          }
          options={PERMISSIONS_OPTIONS}
          title={formatText({ id: 'actionSidebar.permissions' })}
          placeholder={formatText({
            id: 'actionSidebar.managePermissions.roleSelect.placeholder',
          })}
          footer={permissionSelectFooter}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="signature"
        fieldName="authority"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.authority',
            }),
          },
          content: isModeRoleSelected
            ? {
                tooltipContent: formatText({
                  id: 'actionSidebar.managePermissions.authority.disbaledTooltip',
                }),
                selectTriggerRef: (triggerRef) => {
                  if (!triggerRef) {
                    return null;
                  }

                  return triggerRef.querySelector('span');
                },
              }
            : undefined,
        }}
        title={formatText({ id: 'actionSidebar.authority' })}
      >
        <FormCardSelect
          disabled={isModeRoleSelected}
          name="authority"
          options={AUTHORITY_OPTIONS}
          title={formatText({ id: 'actionSidebar.authority' })}
          placeholder={formatText({
            id: 'actionSidebar.managePermissions.authoritySelect.placeholder',
          })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.decisionMethod',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.decisionMethod' })}
      >
        <FormCardSelect
          name="decisionMethod"
          options={DECISION_METHOD_OPTIONS}
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="pencil"
        fieldName="description"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.description',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.description' })}
        isExpandable
      >
        {([
          isDecriptionFieldExpanded,
          {
            toggleOff: toggleOffDecriptionSelect,
            toggleOn: toggleOnDecriptionSelect,
          },
        ]) => (
          <DescriptionField
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
            fieldName="description"
          />
        )}
      </ActionFormRow>
      {role !== REMOVE_ROLE_OPTION_VALUE && (
        <PermissionsTable name="permissions" role={role} />
      )}
    </>
  );
};

ManagePermissionsForm.displayName = displayName;

export default ManagePermissionsForm;
