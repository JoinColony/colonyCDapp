import clsx from 'clsx';

export const colonySidebarBaseClass = clsx(
  /** Unfortunately, it's a bit tricky to string interpolate tailwind classes */
  'top-[calc(var(--header-nav-section-height)+var(--top-content-height))]',
  'z-sidebar flex flex-col justify-between overflow-y-auto bg-gray-900 p-[10px] no-scrollbar',
);

export const colonySidebarTabletClass = clsx(
  colonySidebarBaseClass,
  'fixed left-0 h-[calc(100vh-var(--header-nav-section-height)-var(--top-content-height))] w-full',
);

export const colonySidebarDesktopClass = clsx(
  colonySidebarBaseClass,
  'h-full w-[216px] rounded-lg',
);
