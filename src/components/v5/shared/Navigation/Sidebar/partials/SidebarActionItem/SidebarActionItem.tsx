import React from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Button from '~v5/shared/Button/Button.tsx';

import {
  sidebarButtonClass,
  sidebarButtonIconClass,
  sidebarButtonTextClass,
} from '../../sidebar.styles.ts';

import { type ActionSectionItemProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSideBar.partials.ActionSection.partials.ActionSectionItem';

const ActionSectionItem: React.FC<ActionSectionItemProps> = ({
  Icon,
  translation,
  action,
}) => {
  const { setShowTabletSidebar } = usePageLayoutContext();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const onClick = () => {
    setShowTabletSidebar(false);

    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: action,
    });
  };

  return (
    <Button
      onClick={onClick}
      className={sidebarButtonClass}
      ariaLabel={`Start the ${action.replace('-', ' ')} action`}
    >
      <Icon className={sidebarButtonIconClass} />
      <p className={sidebarButtonTextClass}>{formatText(translation)}</p>
    </Button>
  );
};

ActionSectionItem.displayName = displayName;

export default ActionSectionItem;
