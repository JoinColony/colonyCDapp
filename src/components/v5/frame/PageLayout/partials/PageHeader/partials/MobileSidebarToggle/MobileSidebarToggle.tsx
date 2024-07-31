import { List } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';

const displayName =
  'v5.frame.pageLayout.partials.PageHeader.partials.MobileSidebarToggle';

const MobileSidebarToggle = () => {
  const { toggleSidebar, setShowMobileColonyPicker } = usePageLayoutContext();

  const onClick = () => {
    setShowMobileColonyPicker(false);
    toggleSidebar();
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center gap-[6px]"
    >
      <List className="h-[18px] w-auto flex-shrink-0 text-blue-400" />
      <p className="text-md font-semibold text-blue-400">
        {formatText({ id: 'menu' })}
      </p>
    </button>
  );
};

MobileSidebarToggle.displayName = displayName;

export default MobileSidebarToggle;
