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
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { Authority } from '~types/authority.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';
import { type CardSelectProps } from '~v5/common/Fields/CardSelect/types.ts';

import {
  type ManagePermissionsFormValues,
  RemoveRoleOptionValue,
} from './consts.ts';
import { useManagePermissions } from './hooks.ts';
import PermissionsModal from './partials/PermissionsModal/index.ts';
import PermissionsTable from './partials/PermissionsTable/index.ts';
import PermissionsOptions from './PermissionOptions.tsx';
import { getRoleLabel } from './utils.ts';

const displayName = 'v5.common.ActionSidebar.ManagePermissionsForm';

const FormRow = ActionFormRow<ManagePermissionsFormValues>;

const ManagePermissionsForm: FC<CreateActionFormProps> = ({
  getFormOptions,
}) => {
  const { role, isModRoleSelected } = useManagePermissions(getFormOptions);
  const { isMultiSigEnabled } = useEnabledExtensions();
  const [
    isPermissionsModalOpen,
    {
      toggleOff: togglePermissionsModalOff,
      toggleOn: togglePermissionsModalOn,
    },
  ] = useToggle();
  const team = useWatch<ManagePermissionsFormValues, 'team'>({ name: 'team' });
  const authority: string | undefined = useWatch({ name: 'authority' });

  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const createdInFilterFn = useFilterCreatedInField('team');

  const permissionSelectFooter = useCallback<
    Exclude<CardSelectProps<string>['footer'], React.ReactNode>
  >(
    (close) => (
      <button
        type="button"
        className="flex w-full items-center justify-center py-2 transition-colors duration-200 hover:text-blue-400 focus:outline-none"
        onClick={() => {
          togglePermissionsModalOn();
          close();
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
      options: options.filter(({ value }) => {
        if (value === UserRole.Owner) {
          return team === undefined || Number(team) === Id.RootDomain;
        }
        if (value === UserRole.Mod) {
          return authority !== Authority.ViaMultiSig;
        }
        return true;
      }),
    }),
  );

  const AUTHORITY_OPTIONS = [
    {
      label: formatText({ id: 'actionSidebar.authority.own' }),
      value: Authority.Own,
    },
    ...(isMultiSigEnabled
      ? [
          {
            label: formatText({ id: 'actionSidebar.authority.viaMultiSig' }),
            value: Authority.ViaMultiSig,
          },
        ]
      : []),
  ];

  return (
    <ActionFormLayout>
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
        icon={Signature}
        fieldName="authority"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.authority',
            }),
          },
          content: isModRoleSelected
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
          disabled={isModRoleSelected || hasNoDecisionMethods}
          name="authority"
          options={AUTHORITY_OPTIONS}
          title={formatText({
            id: 'actionSidebar.managePermissions.authoritySelect.title',
          })}
          placeholder={formatText({
            id: 'actionSidebar.managePermissions.authoritySelect.placeholder',
          })}
        />
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
    </ActionFormLayout>
  );
};

ManagePermissionsForm.displayName = displayName;

export default ManagePermissionsForm;
