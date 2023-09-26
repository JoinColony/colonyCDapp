import React, { FC, useMemo } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useManageTokens } from './hooks';
import { ActionFormBaseProps } from '../../../types';
import ActionFormRow from '~v5/common/ActionFormRow';
import TeamsSelect from '~v5/common/ActionSidebar/partials/TeamsSelect';
import { FormCardSelect } from '~v5/common/Fields/CardSelect';
import DescriptionField from '~v5/common/ActionSidebar/partials/DescriptionField';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import TokensTable from '../../TokensTable/TokensTable';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';

const displayName = 'v5.common.ActionSidebar.partials.ManageTokensForm';

const ManageTokensForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const intl = useIntl();
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () => colony?.tokens?.items.filter(notNull) || [],
    [colony?.tokens?.items],
  );

  useManageTokens(getFormOptions);

  return (
    <>
      <ActionFormRow
        iconName="scales"
        fieldName="decisionMethod"
        tooltip={<FormattedMessage id="actionSidebar.toolip.decisionMethod" />}
        title={<FormattedMessage id="actionSidebar.decisionMethod" />}
      >
        <FormCardSelect
          name="decisionMethod"
          options={DECISION_METHOD_OPTIONS}
          title={intl.formatMessage({ id: 'actionSidebar.decisionMethod' })}
        />
      </ActionFormRow>
      <ActionFormRow
        iconName="house-line"
        fieldName="createdIn"
        tooltip={<FormattedMessage id="actionSidebar.toolip.createdIn" />}
        title={<FormattedMessage id="actionSidebar.createdIn" />}
      >
        <TeamsSelect name="createdIn" />
      </ActionFormRow>
      <ActionFormRow
        iconName="pencil"
        fieldName="description"
        className="mb-6"
        tooltip={<FormattedMessage id="actionSidebar.toolip.description" />}
        title={<FormattedMessage id="actionSidebar.description" />}
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
        shouldShowMenu={(token) =>
          !colonyTokens
            .map(({ token: colonyToken }) => colonyToken.tokenAddress)
            .includes(token)
        }
      />
    </>
  );
};

ManageTokensForm.displayName = displayName;

export default ManageTokensForm;
