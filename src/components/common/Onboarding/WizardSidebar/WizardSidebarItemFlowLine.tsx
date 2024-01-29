import clsx from 'clsx';
import React from 'react';

import { type WizardSidebarSubStep } from './WizardSidebarSubItem.tsx';

const displayName =
  'routes.WizardRoute.WizardSidebar.WizardSidebarItem.WizardSidebarItemFlowLine';

interface Props {
  currentStep: number;
  stepId: number;
  subItems?: WizardSidebarSubStep[];
}

const WizardSidebarItemFlowLine = ({
  currentStep,
  stepId,
  subItems,
}: Props) => {
  const lastSubid = subItems ? subItems[subItems.length - 1].id : 0;

  return (
    <div className="absolute w-2.5 flex flex-col items-center top-[13px] gap-2.5 h-[calc(100%+8px)]">
      <div
        className={clsx('w-px h-full bg-gray-900', {
          'h-6': currentStep < stepId || currentStep > lastSubid,
        })}
      />
    </div>
  );
};

WizardSidebarItemFlowLine.displayName = displayName;

export default WizardSidebarItemFlowLine;
