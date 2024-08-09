import {
  CalendarCheck,
  CalendarPlus,
  WarningCircle,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import isDate from 'date-fns/isDate';
import isPast from 'date-fns/isPast';
import React from 'react';
import { useWatch } from 'react-hook-form';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';

import useHasNoDecisionMethods from '../../hooks/permissions/useHasNoDecisionMethods.ts';

import { END_OPTIONS, START_OPTIONS } from './consts.ts';
import TimeRowField from './partials/TimeRowField/TimeRowField.tsx';
import { type TimeRowProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.TimeRow';

const TimeRow = ({ title, tooltips, type = 'start', name }: TimeRowProps) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const selectedDate = useWatch({ name });

  const isDateInPast =
    type === 'start' && isDate(selectedDate) && isPast(selectedDate);

  return (
    <ActionFormRow
      icon={type === 'start' ? CalendarPlus : CalendarCheck}
      fieldName={type}
      title={
        title ??
        formatText({
          id: type === 'start' ? 'actionSidebar.starts' : 'actionSidebar.ends',
        })
      }
      tooltips={tooltips}
      isDisabled={hasNoDecisionMethods}
    >
      <div>
        <TimeRowField
          name={name}
          selectedValueWrapperClassName={clsx({
            'text-warning-400': isDateInPast,
          })}
          options={type === 'start' ? START_OPTIONS : END_OPTIONS}
          placeholder={formatText({
            id:
              type === 'start'
                ? 'actionSidebar.starts.placeholder'
                : 'actionSidebar.ends.placeholder',
          })}
        />
      </div>
      {isDateInPast && (
        <Tooltip
          tooltipContent={formatText({
            id: 'actionSidebar.starts.warningTooltip',
          })}
          className="ml-1"
          placement="top"
        >
          <WarningCircle size={14} className="fill-warning-400" />
        </Tooltip>
      )}
    </ActionFormRow>
  );
};

TimeRow.displayName = displayName;

export default TimeRow;
