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

import { USER_ROLE } from '~constants/permissions.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import { useHasNoDecisionMethods } from '~v5/common/ActionSidebar/hooks/index.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';
import { type CardSelectProps } from '~v5/common/Fields/CardSelect/types.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';
import TeamsSelect from '../../TeamsSelect/index.ts';
import UserSelect from '../../UserSelect/index.ts';

import {
  AUTHORITY_OPTIONS,
  PERMISSIONS_OPTIONS,
  REMOVE_ROLE_OPTION_VALUE,
} from './consts.tsx';
import { useManagePermissions } from './hooks.ts';
import PermissionsModal from './partials/PermissionsModal/index.ts';
import PermissionsTable from './partials/PermissionsTable/index.ts';
import { getRoleLabel } from './utils.tsx';

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
  const team: string | undefined = useWatch({ name: 'team' });

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const permissionSelectFooter = useCallback<
    Exclude<CardSelectProps<string>['footer'], React.ReactNode>
  >(
    ([, { toggleOff }]) => (
      <button
        type="button"
        className="w-full flex justify-center items-center py-2"
        onClick={() => {
          togglePermissionsModalOn();
          toggleOff();
        }}
      >
        <Question size={14} />
        <span className="font-semibold text-sm underline ml-[.375rem]">
          {formatText({
            id: 'actionSidebar.managePermissions.roleSelect.footerCta',
          })}
        </span>
      </button>
    ),
    [togglePermissionsModalOn],
  );

  const ALLOWED_PERMISSION_OPTIONS = PERMISSIONS_OPTIONS.map(
    ({ options, ...rest }) => ({
      ...rest,
      options: options.filter(({ value }) =>
        value === USER_ROLE.Owner ? Number(team) === Id.RootDomain : true,
      ),
    }),
  );

  return (
    <>
      <PermissionsModal
        onClose={togglePermissionsModalOff}
        isOpen={isPermissionsModalOpen}
      />
      <ActionFormRow
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
      </ActionFormRow>
      <ActionFormRow
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
      </ActionFormRow>
      <ActionFormRow
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
          renderSelectedValue={(option, placeholder) =>
            getRoleLabel(option?.value) || placeholder
          }
          options={ALLOWED_PERMISSION_OPTIONS}
          title={formatText({ id: 'actionSidebar.permissions' })}
          placeholder={formatText({
            id: 'actionSidebar.managePermissions.roleSelect.placeholder',
          })}
          itemClassName="group flex text-md md:transition-colors md:[&_.role-title]:hover:font-medium md:hover:bg-gray-50 rounded-lg p-2 w-full cursor-pointer"
          footer={permissionSelectFooter}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
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
          options={AUTHORITY_OPTIONS}
          title={formatText({
            id: 'actionSidebar.managePermissions.authoritySelect.title',
          })}
          placeholder={formatText({
            id: 'actionSidebar.managePermissions.authoritySelect.placeholder',
          })}
        />
      </ActionFormRow>
      <DecisionMethodField />
      <CreatedInRow />
      <DescriptionRow />
      {role !== REMOVE_ROLE_OPTION_VALUE && (
        <PermissionsTable name="permissions" role={role} className="mt-7" />
      )}
    </>
  );
};

ManagePermissionsForm.displayName = displayName;

export default ManagePermissionsForm;
