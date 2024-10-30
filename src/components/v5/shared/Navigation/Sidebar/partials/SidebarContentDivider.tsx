import clsx from 'clsx';
import React from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';

export const SidebarContentDivider = ({
  className,
}: {
  className?: string;
}) => {
  const { isDarkMode } = usePageThemeContext();

  return (
    <div
      className={clsx(
        'mx-3 border-b border-gray-200 md:mx-2 md:border-gray-700',
        {
          'md:!border-gray-200': isDarkMode,
        },
        className,
      )}
    />
  );
};
