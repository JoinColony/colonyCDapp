import { tw } from '~utils/css/index.ts';

export const sidebarButtonClass = tw`flex min-h-[38px] w-full items-center !justify-start !gap-3 rounded-lg !border-none bg-base-white !px-3 !py-3 hover:bg-gray-100 md:bg-gray-900 md:!px-2 md:hover:bg-gray-800`;

export const sidebarButtonIconClass = tw`aspect-auto h-5 w-auto flex-shrink-0 text-gray-900 md:text-base-white`;

export const sidebarButtonTextClass = tw`text-md font-semibold text-gray-900 md:font-medium md:text-base-white`;
