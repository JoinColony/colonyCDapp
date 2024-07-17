import { Id } from '@colony/colony-js';
import {
  Question,
  Shield,
  Signature,
  UserFocus,
  UsersThree,
} from '@phosphor-icons/react';
import React, { type FC, useCallback } from 'react';
import { useWatch } from 'react-hook-form';

import { UserRole } from '~constants/permissions.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';
import { type CardSelectProps } from '~v5/common/Fields/CardSelect/types.ts';

import useHasNoDecisionMethods from '../../../hooks/permissions/useHasNoDecisionMethods.ts';
import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';
import TeamsSelect from '../../TeamsSelect/index.ts';
import UserSelect from '../../UserSelect/index.ts';

import {
  AuthorityOptions,
  type ManagePermissionsFormValues,
  RemoveRoleOptionValue,
} from './consts.ts';
import { useManagePermissions } from './hooks.ts';
import PermissionsModal from './partials/PermissionsModal/index.ts';
import PermissionsTable from './partials/PermissionsTable/index.ts';
import PermissionsOptions from './PermissionOptions.tsx';
import { getRoleLabel } from './utils.ts';

const displayName = 'v5.common.ActionSidebar.partials.ManagePermissionsForm';

const FormRow = ActionFormRow<ManagePermissionsFormValues>;

const ManagePermissionsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { role, isModeRoleSelected } = useManagePermissions(getFormOptions);
  const [
    isPermissionsModalOpen,
    {
      toggleOff: togglePermissionsModalOff,
      toggleOn: togglePermissionsModalOn,
    },
  ] = useToggle();
  const team = useWatch<ManagePermissionsFormValues, 'team'>({ name: 'team' });

  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const createdInFilterFn = useFilterCreatedInField('team');

  const permissionSelectFooter = useCallback<
    Exclude<CardSelectProps<string>['footer'], React.ReactNode>
  >(
    ([, { toggleOff }]) => (
      <button
        type="button"
        className="flex w-full items-center justify-center py-2 transition-colors duration-200 hover:text-blue-400 focus:outline-none"
        onClick={() => {
          togglePermissionsModalOn();
          toggleOff();
        }}
      >
        <Question size={14} />
        <span className="ml-[.375rem] text-sm font-semibold underline">
          {formatText({
            id: 'actionSidebar.managePermissions.roleSelect.footerCta',
          })}
        </span>
      </button>
    ),
    [togglePermissionsModalOn],
  );

  const ALLOWED_PERMISSION_OPTIONS = PermissionsOptions.map(
    ({ options, ...rest }) => ({
      ...rest,
      options: options.filter(({ value }) =>
        value === UserRole.Owner ? Number(team) === Id.RootDomain : true,
      ),
    }),
  );

  return (
    <>
      <PermissionsModal
        onClose={togglePermissionsModalOff}
        isOpen={isPermissionsModalOpen}
      />
      <FormRow
        icon={UserFocus}
        fieldName="member"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.managePermissions.member',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.member' })}
        isDisabled={hasNoDecisionMethods}
      >
        <UserSelect name="member" disabled={hasNoDecisionMethods} />
      </FormRow>
      <FormRow
        icon={UsersThree}
        fieldName="team"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.managePermissions.team',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.managePermissions.team' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="team" disabled={hasNoDecisionMethods} />
      </FormRow>
      <FormRow
        icon={Shield}
        fieldName="role"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.managePermissions.permissions',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.permissions' })}
        isDisabled={hasNoDecisionMethods}
      >
        <FormCardSelect
          name="role"
          cardClassName="max-w-[calc(100vw-2.5rem)] md:max-w-sm md:px-4 md:[&_.section-title]:px-2"
          renderSelectedValue={(_, placeholder) =>
            getRoleLabel(role) || placeholder
          }
          options={ALLOWED_PERMISSION_OPTIONS}
          title={formatText({ id: 'actionSidebar.permissions' })}
          placeholder={formatText({
            id: 'actionSidebar.managePermissions.roleSelect.placeholder',
          })}
          itemClassName="group flex text-md md:transition-colors md:[&_.role-title]:hover:font-medium md:hover:bg-gray-50 rounded-lg p-2 w-full cursor-pointer"
          footer={permissionSelectFooter}
          disabled={hasNoDecisionMethods}
          valueOverride={role}
        />
      </FormRow>
      <FormRow
        icon={Signature}
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
        isDisabled={hasNoDecisionMethods}
      >
        <FormCardSelect
          disabled={isModeRoleSelected || hasNoDecisionMethods}
          name="authority"
          options={AuthorityOptions}
          title={formatText({
            id: 'actionSidebar.managePermissions.authoritySelect.title',
          })}
          placeholder={formatText({
            id: 'actionSidebar.managePermissions.authoritySelect.placeholder',
          })}
        />
      </FormRow>
      <DecisionMethodField />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      {role !== RemoveRoleOptionValue.remove && (
        <PermissionsTable
          name="permissions"
          role={role as UserRole}
          className="mt-7"
        />
      )}
    </>
  );
};

ManagePermissionsForm.displayName = displayName;

export default ManagePermissionsForm;
