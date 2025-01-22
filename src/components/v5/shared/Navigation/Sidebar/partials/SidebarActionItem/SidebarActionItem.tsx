import clsx from 'clsx';
import React from 'react';

import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { formatText } from '~utils/intl.ts';
import {
  sidebarButtonClass,
  sidebarButtonIconClass,
  sidebarButtonTextClass,
} from '~v5/shared/Navigation/Sidebar/sidebar.styles.ts';

import { type ActionSectionItemProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSideBar.partials.ActionSection.partials.ActionSectionItem';

const ActionSectionItem: React.FC<ActionSectionItemProps> = ({
  Icon,
  translation,
  action,
}) => {
  const { setShowTabletSidebar } = usePageLayoutContext();

  const { isDarkMode } = usePageThemeContext();

  const { showActionSidebar } = useActionSidebarContext();

  const onClick = () => {
    setShowTabletSidebar(false);

    showActionSidebar(ActionSidebarMode.CreateAction, {
      action,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(sidebarButtonClass, {
        '!bg-base-white hover:!bg-gray-50 md:!bg-gray-100': isDarkMode,
      })}
      aria-label={`Start the ${action.replace('-', ' ')} action`}
    >
      <Icon
        className={clsx(sidebarButtonIconClass, {
          '!text-gray-900': isDarkMode,
        })}
      />
      <p
        className={clsx(sidebarButtonTextClass, {
          '!text-gray-900': isDarkMode,
        })}
      >
        {formatText(translation)}
      </p>
    </button>
  );
};

ActionSectionItem.displayName = displayName;

export default ActionSectionItem;
