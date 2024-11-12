import { tw } from '~utils/css/index.ts';

const buttonClasses = {
  primarySolid: tw`border border-gray-900 bg-gray-900 text-base-white disabled:border-gray-300
    disabled:bg-gray-300 md:hover:bg-base-white md:hover:text-gray-900`,
  primaryOutline: tw`border border-gray-300 bg-base-white text-gray-700 disabled:text-gray-300
    md:hover:border-gray-900 md:hover:bg-base-white md:hover:text-gray-900`,
  primarySolidFull: tw`border border-gray-900 bg-gray-900 text-base-white disabled:border-none
    disabled:bg-gray-300`,
  primaryOutlineFull: tw`border border-gray-100 bg-base-white text-gray-700 disabled:text-gray-300
    md:hover:border-gray-900 md:hover:bg-gray-900 md:hover:text-base-white`,
  secondarySolid: tw`bg-negative-400 text-base-white disabled:bg-gray-300
    md:hover:bg-negative-300`,
  secondaryOutline: tw`border border-negative-400 bg-base-white text-negative-400
    disabled:border-gray-300 disabled:text-gray-300 md:hover:bg-negative-400
    md:hover:text-base-white`,
  tertiary: tw`border border-gray-200 bg-base-white text-gray-700 disabled:text-gray-300
    md:hover:border-gray-900`,
  quaternary: tw`border border-negative-200 bg-base-white text-negative-400
    disabled:border-gray-300 disabled:text-gray-300 md:hover:bg-negative-400
    md:hover:text-base-white`,
  quinary: tw`border border-gray-900 bg-base-white text-gray-900 disabled:border-gray-300
    disabled:text-gray-300 md:hover:border-gray-900 md:hover:bg-gray-900
    md:hover:text-base-white`,
  senary: tw`w-full justify-start rounded px-4 py-2 text-md
    md:hover:bg-gray-50 md:hover:font-medium`,
  septenary: tw`border border-gray-200 bg-base-white text-gray-700 disabled:text-gray-300
    md:hover:border-gray-900 md:hover:bg-gray-900 md:hover:text-base-white`,
  completed: tw`border border-success-400 bg-success-400 text-base-white`,
  link: tw`!m-0 min-h-[auto] !px-0 !py-0 text-sm font-medium text-blue-400 underline`,
};

export default buttonClasses;
