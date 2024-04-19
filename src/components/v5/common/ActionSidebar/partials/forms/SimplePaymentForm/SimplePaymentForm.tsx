import { UserFocus, UsersThree } from '@phosphor-icons/react';
import React, { useEffect, type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

import useHasNoDecisionMethods from '../../../hooks/permissions/useHasNoDecisionMethods.ts';
import { type ActionFormBaseProps } from '../../../types.ts';
import AmountRow from '../../AmountRow/AmountRow.tsx';
import CreatedIn from '../../CreatedIn/CreatedIn.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';
import TeamsSelect from '../../TeamsSelect/index.ts';
import UserSelect from '../../UserSelect/index.ts';

import { useSimplePayment } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SimplePaymentForm';

const SimplePaymentForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useSimplePayment(getFormOptions);

  const { setValue, watch } = useFormContext();
  const selectedTeam = watch('from');
  const createdIn = watch(CREATED_IN_FIELD_NAME);
  const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  useEffect(() => {
    if (decisionMethod !== DecisionMethod.Reputation) return;

    if (!selectedTeam && createdIn > 1) {
      setValue('from', createdIn);
      return;
    }

    if (!!selectedTeam && createdIn !== selectedTeam && createdIn !== 1) {
      setValue(CREATED_IN_FIELD_NAME, selectedTeam);
    }
  }, [createdIn, decisionMethod, selectedTeam, setValue]);

  const createdInFilterFn = (team: SearchSelectOption): boolean => {
    if (!selectedTeam) return true;

    return team.value === selectedTeam || !!team.isRoot;
  };

  return (
    <>
      <ActionFormRow
        icon={UsersThree}
        fieldName="from"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.from',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.from' })}
        isDisabled={hasNoDecisionMethods}
      >
        <TeamsSelect name="from" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <ActionFormRow
        icon={UserFocus}
        fieldName="recipient"
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            }),
          },
        }}
        title={formatText({ id: 'actionSidebar.recipient' })}
        isDisabled={hasNoDecisionMethods}
      >
        <UserSelect name="recipient" disabled={hasNoDecisionMethods} />
      </ActionFormRow>
      <AmountRow
        domainId={selectedTeam}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.simplePayment.amount',
            }),
          },
        }}
      />
      <DecisionMethodField />
      <CreatedIn filterOptionsFn={createdInFilterFn} />
      <Description />
      {/* Disabled for now */}
      {/* <TransactionTable name="payments" /> */}
    </>
  );
};

SimplePaymentForm.displayName = displayName;

export default SimplePaymentForm;
