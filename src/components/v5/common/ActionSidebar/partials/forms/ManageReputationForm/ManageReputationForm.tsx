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
import { useHasNoDecisionMethods } from '~v5/common/ActionSidebar/hooks/index.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';
import TeamsSelect from '../../TeamsSelect/index.ts';
import { useUserSelect } from '../../UserSelect/hooks.ts';
import UserSelect from '../../UserSelect/index.ts';

import { ModificationOption, modificationOptions } from './consts.ts';
import { useManageReputation } from './hooks.ts';
import ManageReputationTable from './partials/ManageReputationTable/index.ts';

const ManageReputationForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
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
  const { resetField } = useFormContext();

  useManageReputation(getFormOptions);

  const { usersOptions } = useUserSelect({
    domainId: selectedTeam,
    filterOptionsFn:
      modification === ModificationOption.RemoveReputation
        ? (option) => !!option.userReputation
        : undefined,
  });

  useEffect(() => {
    if (
      modification === ModificationOption.RemoveReputation &&
      !usersOptions.options.find((option) => option.value === member)
    ) {
      resetField(MEMBER_FIELD_NAME);
    }
  }, [member, modification, resetField, usersOptions.options]);

  return (
    <>
      <div className="w-full mb-6">
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
            filterOptionsFn={
              modification === ModificationOption.AwardReputation
                ? (option) => option.value === Id.RootDomain
                : undefined
            }
          />
        </ActionFormRow>
        <DecisionMethodField />
        <CreatedIn
          filterOptionsFn={(option) => {
            if (modification === ModificationOption.AwardReputation) {
              return option.value === Id.RootDomain;
            }

            return (
              option.value === Id.RootDomain || option.value === selectedTeam
            );
          }}
        />
        <Description />
      </div>
      <ManageReputationTable />
    </>
  );
};

export default ManageReputationForm;
