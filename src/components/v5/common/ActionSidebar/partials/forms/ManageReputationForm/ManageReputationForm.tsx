import React, { FC } from 'react';

import {
  ArrowsOutLineVertical,
  HouseLine,
  Scales,
  UserFocus,
  UsersThree,
} from 'phosphor-react';
import { useWatch } from 'react-hook-form';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import { formatText } from '~utils/intl';

import { useManageReputation } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useDecisionMethods } from '../../../hooks';
import DescriptionRow from '../../DescriptionRow';
import UserSelect from '../../UserSelect';
import ManageReputationTable from './partials/ManageReputationTable';
import { modificationOptions } from './consts';

const displayName = 'v5.common.ActionSidebar.partials.ManageReputationForm';

const ManageReputationForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { decisionMethods } = useDecisionMethods();

  useManageReputation(getFormOptions);
  const decisionMethod = useWatch({ name: 'decisionMethod' });
  const ICON_SIZE = 14;

  return (
    <>
      <ActionFormRow
        icon={<UserFocus size={ICON_SIZE} />}
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
        icon={<ArrowsOutLineVertical size={ICON_SIZE} />}
        fieldName="modification"
        title={formatText({ id: 'actionSidebar.modification' })}
      >
        <FormCardSelect
          name="modification"
          options={modificationOptions}
          placeholder={formatText({
            id: 'actionSidebar.modification.placeholder',
          })}
          title={formatText({ id: 'actionSidebar.modification.title' })}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={<UsersThree size={ICON_SIZE} />}
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
        icon={<Scales size={ICON_SIZE} />}
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
          options={decisionMethods}
          placeholder={formatText({
            id: 'actionSidebar.decisionMethod.placeholder',
          })}
          title={formatText({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      {decisionMethod && decisionMethod === DecisionMethod.Reputation && (
        <ActionFormRow
          icon={<HouseLine size={ICON_SIZE} />}
          fieldName="createdIn"
          tooltips={{
            label: {
              tooltipContent: formatText({
                id: 'actionSidebar.tooltip.createdIn',
              }),
            },
          }}
          title={formatText({ id: 'actionSidebar.createdIn' })}
        >
          <TeamsSelect name="createdIn" />
        </ActionFormRow>
      )}
      <DescriptionRow />
      <ManageReputationTable />
    </>
  );
};

ManageReputationForm.displayName = displayName;

export default ManageReputationForm;
