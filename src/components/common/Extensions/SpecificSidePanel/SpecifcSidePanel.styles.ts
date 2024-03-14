import { tw } from '~utils/css/index.ts';

const specificSidePanelClasses = {
  panelRow: tw`flex min-h-[1.875rem] items-center gap-x-2`,
  panelTitle: tw`w-[calc(50%-1rem)] shrink-0 text-sm font-normal text-gray-600`,
  panelData: tw`justify-start text-md font-normal`,
};

export default specificSidePanelClasses;
