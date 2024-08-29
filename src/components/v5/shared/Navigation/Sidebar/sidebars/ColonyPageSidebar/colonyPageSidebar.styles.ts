import clsx from 'clsx';

const colonyPageSidebarBaseClass = 'overflow-y-auto';

export const colonyPageSidebarTabletClass = clsx(
  /** Unfortunately, it's a bit tricky to string interpolate tailwind classes */
  'top-[calc(var(--header-nav-section-height)+var(--top-content-height))]',
  'fixed left-0 !h-[calc(100vh-var(--header-nav-section-height)-var(--top-content-height))] w-full',
  'z-sidebar flex flex-col justify-between overflow-y-auto bg-base-white p-3 md:bg-gray-900',
);

export const colonyPageSidebarDesktopClass = clsx(
  colonyPageSidebarBaseClass,
  '!w-[216px]',
);
