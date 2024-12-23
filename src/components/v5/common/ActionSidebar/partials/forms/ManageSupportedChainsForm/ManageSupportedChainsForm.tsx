import { Link, PlusMinus } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/ActionFormRow.tsx';
import {
  CHAIN_FIELD_NAME,
  MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import ChainSelect from '~v5/common/ActionSidebar/partials/ChainSelect/ChainSelect.tsx';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/DecisionMethodField.tsx';
import Description from '~v5/common/ActionSidebar/partials/Description/Description.tsx';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';
import { FormCardSelect } from '~v5/common/Fields/CardSelect/index.ts';

import { getManageSupportedChainsOptions } from './consts.ts';
import { useManageSupportedChainsForm } from './hooks.ts';

const displayName =
  'v5.common.ActionSidebar.partials.ManageSupportedChainsForm';

const ManageSupportedChainsForm: FC<ActionFormBaseProps> = ({
  getFormOptions,
}) => {
  const { manageSupportedChainsOptions } = getManageSupportedChainsOptions();
  const { resetField } = useFormContext();
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  useManageSupportedChainsForm(getFormOptions);

  return (
    <>
      <ActionFormRow
        icon={PlusMinus}
        fieldName={MANAGE_SUPPORTED_CHAINS_FIELD_NAME}
        title={formatText({ id: 'actionSidebar.manageSupportedChains' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.manageSupportedChains',
            }),
          },
        }}
        isDisabled={hasNoDecisionMethods}
      >
        <FormCardSelect
          name={MANAGE_SUPPORTED_CHAINS_FIELD_NAME}
          options={manageSupportedChainsOptions}
          onChange={() => {
            resetField(CHAIN_FIELD_NAME);
          }}
          placeholder={formatText({
            id: 'actionSidebar.manageSupportedChains.placeholder',
          })}
          title={formatText({
            id: 'actionSidebar.manageSupportedChains.title',
          })}
          disabled={hasNoDecisionMethods}
        />
      </ActionFormRow>
      <ActionFormRow
        icon={Link}
        fieldName={CHAIN_FIELD_NAME}
        title={formatText({ id: 'actionSidebar.chain' })}
        isDisabled={hasNoDecisionMethods}
      >
        <ChainSelect name={CHAIN_FIELD_NAME} />
      </ActionFormRow>
      <DecisionMethodField />
      <Description />
    </>
  );
};

ManageSupportedChainsForm.displayName = displayName;

export default ManageSupportedChainsForm;
