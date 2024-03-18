import { formatNumeral, unformatNumeral } from 'cleave-zen';
import clsx from 'clsx';
import React, { type ChangeEvent, useState, type FC, useEffect } from 'react';
import { useController, useWatch } from 'react-hook-form';

import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import ManageReputationTableBase from '~v5/common/ActionSidebar/partials/ManageReputationTable/index.ts';

import { useReputationAmountField, useReputationFields } from './hooks.ts';

const ManageReputationTable: FC = () => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'amount',
  });
  const [value, setValue] = useState('');

  const {
    team: domainId,
    member: selectedUser,
    modification: selectedModification,
  } = useWatch<{
    team: number;
    member: string;
    modification: string;
  }>();

  const {
    amountPercentageValue,
    formattedNewReputationPoints,
    formattedReputationPoints,
    newPercentageReputation,
    percentageReputation,
    userReputationLoading,
  } = useReputationFields();

  const isTeamSelected = domainId !== undefined;
  const isLoading = userReputationLoading && selectedUser && isTeamSelected;

  const { adjustInputWidth, formattingOptions, inputRef } =
    useReputationAmountField(120);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const unformattedValue = unformatNumeral(e.target.value);

    field.onChange(unformattedValue);
    setValue(formatNumeral(e.target.value, formattingOptions));
    adjustInputWidth();
  };

  useEffect(() => {
    const unformattedValue = unformatNumeral(value);

    if (field.value && field.value !== unformattedValue) {
      setValue(formatNumeral(field.value, formattingOptions));
    }
  }, [value, field, formattingOptions]);

  const isChangeFieldDisabled =
    userReputationLoading ||
    !selectedUser ||
    !isTeamSelected ||
    !selectedModification;

  const changeContent = (
    <div
      className={clsx('text-md flex items-center flex-wrap gap-x-2', {
        'text-negative-400': !!error,
        'text-gray-400': isChangeFieldDisabled,
        'text-gray-900': !isChangeFieldDisabled && !error,
      })}
    >
      <input
        ref={(ref) => {
          inputRef.current = ref || undefined;
          adjustInputWidth();
        }}
        disabled={isChangeFieldDisabled}
        name="amount"
        className={clsx('flex-shrink outline-0 outline-none', {
          'placeholder:text-gray-400': !error,
          'placeholder:text-negative-400': !!error,
        })}
        placeholder="0"
        value={value}
        autoComplete="off"
        onChange={handleFieldChange}
      />
      <div className="flex-shrink-0">
        {formatText(
          { id: 'actionSidebar.manageReputation.points.percentage' },
          {
            percentage: <Numeral value={amountPercentageValue} suffix="%" />,
          },
        )}
      </div>
    </div>
  );

  return (
    <ManageReputationTableBase
      changeContent={changeContent}
      formattedNewReputationPoints={
        isTeamSelected ? formattedNewReputationPoints : '0'
      }
      formattedReputationPoints={
        isTeamSelected ? formattedReputationPoints : '0'
      }
      isLoading={!!isLoading}
      newPercentageReputation={isTeamSelected ? newPercentageReputation : 0}
      percentageReputation={isTeamSelected ? percentageReputation : 0}
      isError={!!error}
    />
  );
};

export default ManageReputationTable;
