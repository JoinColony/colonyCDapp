import { tw } from '~utils/css/index.ts';

const transactionsItemClasses = {
  listItem: tw`relative rounded bg-gray-50 px-3.5 py-[0.4375rem] text-sm 
                 before:absolute before:left-0 before:top-[0.4375rem] 
                 before:block before:h-[1rem] before:w-0.5 before:content-[""] 
                 first:pt-3 first:before:top-3 last:pb-3`,
};

export default transactionsItemClasses;
