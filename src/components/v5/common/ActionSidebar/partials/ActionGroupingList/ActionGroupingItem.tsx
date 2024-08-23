import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { type Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { ACTION_TYPE_FIELD_NAME } from '../../consts.ts';

type ThemeColor = 'blue' | 'success' | 'purple' | 'orange';

export interface ActionGroupingItemProps {
  title: string;
  description: string;
  Icon: Icon;
  action: Action;
  color?: ThemeColor;
  isNew?: boolean;
}

export const ActionGroupingItem: FC<ActionGroupingItemProps> = ({
  title,
  description,
  Icon,
  action,
  color = 'blue',
  isNew = false,
}) => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const onClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: action,
    });
  };
  const iconColorClass = `text-${color}-400`;
  const bgColorClass = `bg-${color}-100`;

  return (
    <button
      onClick={onClick}
      type="button"
      className="relative my-[1px] flex h-full w-full flex-col items-start rounded-lg border border-gray-200 p-5 text-left transition-colors hover:bg-gray-25"
    >
      <div className={clsx('mb-2 rounded-lg p-[7px]', bgColorClass)}>
        <Icon size={22} className={iconColorClass} />
      </div>
      {isNew && (
        <PillsBase className="absolute right-5 top-6 bg-success-100 text-success-400">
          {formatText({ id: 'badge.new' })}
        </PillsBase>
      )}
      <h3 className="text-md font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </button>
  );
};
