import { Id } from '@colony/colony-js';
import {
  ArrowsOutLineVertical,
  HouseLine,
  UserFocus,
} from '@phosphor-icons/react';
import React, { useEffect, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import {
  MEMBER_FIELD_NAME,
  MODIFICATION_FIELD_NAME,
  TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useFilterCreatedInField from '~v5/common/ActionSidebar/hooks/useFilterCreatedInField.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect/index.ts';
import { useUserSelect } from '~v5/common/ActionSidebar/partials/UserSelect/hooks.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { ModificationOption, modificationOptions } from './consts.ts';
import { useManageReputation } from './hooks.ts';
import ManageReputationTable from './partials/ManageReputationTable/index.ts';

const ManageReputationForm: FC<CreateActionFormProps> = ({
  getFormOptions,
}) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const {
    team: selectedTeam,
    modification,
    member,
  } = useWatch<{
    team: number;
    modification: string;
    member: string;
  }>();
  const { setValue, resetField } = useFormContext();

  useManageReputation(getFormOptions);

  const { usersOptions } = useUserSelect({
    domainId: selectedTeam,
    filterOptionsFn:
      modification === ModificationOption.RemoveReputation
        ? (option) => !!option.userReputation
        : undefined,
  });

  const createdInFilterFn = useFilterCreatedInField(
    TEAM_FIELD_NAME,
    modification === ModificationOption.AwardReputation,
  );

  useEffect(() => {
    if (
      modification === ModificationOption.RemoveReputation &&
      !usersOptions.options.find((option) => option.value === member)
    ) {
      resetField(MEMBER_FIELD_NAME);
    }
  }, [member, modification, resetField, usersOptions.options]);

  useEffect(() => {
    if (modification === ModificationOption.AwardReputation) {
      setValue(TEAM_FIELD_NAME, Id.RootDomain);
    }
  }, [modification, setValue]);

  return (
    <>
      <div className="mb-6 w-full">
        <ActionFormRow
          icon={ArrowsOutLineVertical}
          fieldName={MODIFICATION_FIELD_NAME}
          tooltips={{
            label: {
              tooltipContent: formatText({
                id: 'actionSidebar.tooltip.manageReputation.modification',
              }),
            },
          }}
          title={formatText({ id: 'actionSidebar.modification' })}
          isDisabled={hasNoDecisionMethods}
        >
          <FormCardSelect
            name={MODIFICATION_FIELD_NAME}
            options={modificationOptions}
            title={formatText({ id: 'actionSidebar.changeType' })}
            placeholder={formatText({
              id: 'actionSidebar.modification.placeholder',
            })}
            disabled={hasNoDecisionMethods}
            cardClassName="sm:min-w-[12.875rem]"
          />
        </ActionFormRow>
        <ActionFormRow
          icon={UserFocus}
          fieldName={MEMBER_FIELD_NAME}
          tooltips={{
            label: {
              tooltipContent: formatText({
                id: 'actionSidebar.tooltip.managePermissions.member',
              }),
            },
          }}
          title={formatText({ id: 'actionSidebar.member' })}
          isDisabled={hasNoDecisionMethods || !modification}
        >
          <UserSelect
            name={MEMBER_FIELD_NAME}
            disabled={hasNoDecisionMethods || !modification}
            options={usersOptions}
            tooltipContent={
              !modification
                ? formatText({
                    id: 'actionSidebar.modification.tooltip',
                  })
                : undefined
            }
          />
        </ActionFormRow>
        <ActionFormRow
          icon={HouseLine}
          fieldName={TEAM_FIELD_NAME}
          title={formatText({ id: 'actionSidebar.team' })}
          tooltips={{
            label: {
              tooltipContent: formatText({
                id: 'actionSidebar.tooltip.editTeam.selectTeam',
              }),
            },
          }}
          isDisabled={hasNoDecisionMethods}
        >
          <TeamsSelect
            name={TEAM_FIELD_NAME}
            disabled={hasNoDecisionMethods}
            readonly={modification === ModificationOption.AwardReputation}
            filterOptionsFn={
              modification === ModificationOption.AwardReputation
                ? (option) => option.value === Id.RootDomain
                : undefined
            }
          />
        </ActionFormRow>
        <DecisionMethodField />
        <CreatedIn
          filterOptionsFn={createdInFilterFn}
          readonly={modification === ModificationOption.AwardReputation}
        />
        <Description />
      </div>
      <ManageReputationTable />
    </>
  );
};

export default ManageReputationForm;
