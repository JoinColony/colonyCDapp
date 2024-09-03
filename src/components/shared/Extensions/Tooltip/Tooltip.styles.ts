import { tw } from '~utils/css/index.ts';

const topPlacementClasses = tw`
    group-data-[popper-placement*='top']:-mb-2
    group-data-[popper-placement*='top']:h-2.5
    group-data-[popper-placement*='top']:before:border-b-0
    group-data-[popper-placement*='top']:before:border-l-[0.5rem]
    group-data-[popper-placement*='top']:before:border-r-[0.5rem]
    group-data-[popper-placement*='top']:before:border-t-[0.625rem]
    group-data-[popper-placement*='top']:before:border-b-transparent
    group-data-[popper-placement*='top']:before:border-l-transparent
    group-data-[popper-placement*='top']:before:border-r-transparent
    group-data-[popper-placement*='top']:before:border-t-current
`;

const leftPlacementClasses = tw`
    group-data-[popper-placement*='left']:-mr-2
    group-data-[popper-placement*='left']:w-2.5
    group-data-[popper-placement*='left']:before:border-b-[0.5rem]
    group-data-[popper-placement*='left']:before:border-l-[0.625rem]
    group-data-[popper-placement*='left']:before:border-r-0
    group-data-[popper-placement*='left']:before:border-t-[0.5rem]
    group-data-[popper-placement*='left']:before:border-b-transparent
    group-data-[popper-placement*='left']:before:border-l-current
    group-data-[popper-placement*='left']:before:border-r-transparent
    group-data-[popper-placement*='left']:before:border-t-transparent
`;

const bottomPlacementClasses = tw`
    group-data-[popper-placement*='bottom']:-mt-2
    group-data-[popper-placement*='bottom']:h-2.5
    group-data-[popper-placement*='bottom']:before:border-b-[0.625rem]
    group-data-[popper-placement*='bottom']:before:border-l-[0.5rem]
    group-data-[popper-placement*='bottom']:before:border-r-[0.5rem]
    group-data-[popper-placement*='bottom']:before:border-t-0
    group-data-[popper-placement*='bottom']:before:border-b-current
    group-data-[popper-placement*='bottom']:before:border-l-transparent
    group-data-[popper-placement*='bottom']:before:border-r-transparent
    group-data-[popper-placement*='bottom']:before:border-t-transparent
`;

const topAndBottomStartPlacementClasses = tw`
    group-data-[popper-placement='bottom-start']:!left-2
    group-data-[popper-placement='top-start']:!left-2
    group-data-[popper-placement='top-start']:!top-auto
    group-data-[popper-placement='bottom-start']:!transform-none
    group-data-[popper-placement='top-start']:!transform-none
`;

const topAndBottomEndPlacementClasses = tw`
    group-data-[popper-placement='bottom-end']:!left-full
    group-data-[popper-placement='bottom-end']:!top-full
    group-data-[popper-placement='top-end']:!left-full
    group-data-[popper-placement='top-end']:!top-full
    group-data-[popper-placement='bottom-end']:!-translate-x-[150%]
    group-data-[popper-placement='bottom-end']:!translate-y-1/2
    group-data-[popper-placement='top-end']:!-translate-x-[150%]
    group-data-[popper-placement='top-end']:!translate-y-1/2
`;

const rightPlacementClasses = tw`
    group-data-[popper-placement*='right']:-ml-2
    group-data-[popper-placement*='right']:w-2.5
    group-data-[popper-placement*='right']:before:border-b-[0.5rem]
    group-data-[popper-placement*='right']:before:border-l-0
    group-data-[popper-placement*='right']:before:border-r-[0.625rem]
    group-data-[popper-placement*='right']:before:border-t-[0.5rem]
    group-data-[popper-placement*='right']:before:border-b-transparent
    group-data-[popper-placement*='right']:before:border-l-transparent
    group-data-[popper-placement*='right']:before:border-r-current
    group-data-[popper-placement*='right']:before:border-t-transparent
`;

const tooltipClasses = {
  tooltipContainer: tw`group relative
    rounded-none border-none p-3
    !text-base-white shadow-none text-3
    hover-[&_a]:no-underline
    data-[popper-interactive='false']:pointer-events-auto`,
  tooltipArrow: tw`
    after:hidden
    ${topPlacementClasses}
    ${leftPlacementClasses}
    ${bottomPlacementClasses}
    ${topAndBottomEndPlacementClasses}
    ${topAndBottomStartPlacementClasses}
    ${rightPlacementClasses}
    ${topAndBottomEndPlacementClasses}
  `,
};

export default tooltipClasses;
