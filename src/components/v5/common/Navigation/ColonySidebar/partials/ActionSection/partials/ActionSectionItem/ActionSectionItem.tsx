import React from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import {
  sidebarButtonIconStyles,
  sidebarButtonStyles,
  sidebarButtonTextStyles,
} from '~v5/common/Navigation/consts.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { type ActionSectionItemProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSideBar.partials.ActionSection.partials.ActionSectionItem';

const ActionSectionItem: React.FC<ActionSectionItemProps> = ({
  Icon,
  translation,
  action,
}) => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const onClick = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: action,
    });
  };

  return (
    <Button onClick={onClick} className={sidebarButtonStyles}>
      <Icon className={sidebarButtonIconStyles} />
      <p className={sidebarButtonTextStyles}>{formatText(translation)}</p>
    </Button>
  );
};

ActionSectionItem.displayName = displayName;

export default ActionSectionItem;
