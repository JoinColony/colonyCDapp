import clsx from 'clsx';

const colonyPageSidebarBaseClass = 'overflow-y-auto';

export const colonyPageSidebarTabletClass = clsx(
  /** Unfortunately, it's a bit tricky to string interpolate tailwind classes */
  'top-[calc(var(--header-nav-section-height)+var(--top-content-height))]',
  'z-sidebar overflow-y-auto bg-gray-900 p-[10px]',
  'fixed left-0 !h-[calc(100vh-var(--header-nav-section-height)-var(--top-content-height))] w-full',
);

export const colonyPageSidebarDesktopClass = clsx(
  colonyPageSidebarBaseClass,
  '!w-[216px]',
);
