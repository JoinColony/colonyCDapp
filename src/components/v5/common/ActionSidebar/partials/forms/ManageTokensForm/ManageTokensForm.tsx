import React, { FC } from 'react';

import { useManageTokens } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import TokensTable from '../../TokensTable/TokensTable';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionSidebar.partials.ManageTokensForm';

const ManageTokensForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { shouldShowMenu } = useManageTokens(getFormOptions);

  return (
    <>
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
        iconName="house-line"
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
      <ActionFormRow
        iconName="pencil"
        fieldName="description"
        className="mb-6"
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
            fieldName="annotation"
          />
        )}
      </ActionFormRow>
      <TokensTable
        name="selectedTokenAddresses"
        shouldShowMenu={shouldShowMenu}
      />
    </>
  );
};

ManageTokensForm.displayName = displayName;

export default ManageTokensForm;
