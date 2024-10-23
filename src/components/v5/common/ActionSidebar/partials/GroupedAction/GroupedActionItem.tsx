import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { type Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

type ThemeColor = 'blue' | 'success' | 'purple' | 'warning';

const getIconClassesByColor = (color: ThemeColor) => {
  let iconColorClass = '';
  let bgColorClass = '';

  switch (color) {
    case 'blue':
      iconColorClass = `text-blue-400`;
      bgColorClass = `bg-blue-100`;
      break;
    case 'success':
      iconColorClass = `text-success-400`;
      bgColorClass = `bg-success-100`;
      break;
    case 'purple':
      iconColorClass = `text-purple-400`;
      bgColorClass = `bg-purple-100`;
      break;
    case 'warning':
      iconColorClass = `text-warning-400`;
      bgColorClass = `bg-warning-100`;
      break;
    default:
      break;
  }
  return {
    iconColorClass,
    bgColorClass,
  };
};

export interface GroupedActionItemProps {
  title: string;
  description: string;
  Icon: Icon;
  action: Action;
  color?: ThemeColor;
  isNew?: boolean;
}

export const GroupedActionItem: FC<GroupedActionItemProps> = ({
  title,
  description,
  Icon,
  action,
  color = 'blue',
  isNew = false,
}) => {
  const {
    actionSidebarInitialValues,
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const onClick = () => {
    toggleActionSidebarOn({
      ...actionSidebarInitialValues,
      [ACTION_TYPE_FIELD_NAME]: action,
    });
  };

  const { bgColorClass, iconColorClass } = getIconClassesByColor(color);
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative my-[1px] flex h-full w-full flex-col items-start rounded-lg border border-gray-200 p-5 text-left transition-colors hover:bg-gray-25"
    >
      <div className="mb-2 flex w-full items-center justify-between">
        <div className={clsx('rounded-lg p-[7px]', bgColorClass)}>
          <Icon size={22} className={iconColorClass} />
        </div>
        {isNew && (
          <PillsBase className="bg-success-100 text-success-400">
            {formatText({ id: 'badge.new' })}
          </PillsBase>
        )}
      </div>
      <h3 className="text-md font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </button>
  );
};
