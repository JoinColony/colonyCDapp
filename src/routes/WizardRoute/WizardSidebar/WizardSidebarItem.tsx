import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import { useWizardContext } from '~context/WizardContext';

import WizardSidebarSubItem, { WizardSubStep } from './WizardSidebarSubItem';
import { WizardStep } from './WizardSidebar';
import WizardSidebarItemFlowLine from './WizardSidebarItemFlowLine';

const displayName = 'routes.WizardRoute.WizardSidebar.WizardSidebarItem';

interface Props extends WizardStep {
  isLastItem: boolean;
}

const getLatestSubItemOnDisplay = (
  miniItemStep: number,
  subItems: WizardSubStep[],
): WizardSubStep | undefined => {
  const latestSubItem = subItems.find(
    (subItem) => miniItemStep - 1 === subItem.itemStep,
  );

  if (!latestSubItem && miniItemStep > -1) {
    return getLatestSubItemOnDisplay(miniItemStep - 1, subItems);
  }

  return latestSubItem;
};

const WizardSidebarItem = ({
  itemStep,
  itemText,
  subItems,
  isLastItem,
}: Props) => {
  const { currentStep } = useWizardContext();
  const isStepOnDisplay = !!subItems?.find(
    (subItemStep) => currentStep === subItemStep.itemStep,
  )?.itemText;
  const latestSubItem = !isStepOnDisplay
    ? getLatestSubItemOnDisplay(currentStep, subItems || [])
    : undefined;

  return (
    <div className="flex flex-col justify-start relative">
      {!isLastItem && (
        <WizardSidebarItemFlowLine itemStep={itemStep} subItems={subItems} />
      )}
      <div className="flex items-center relative">
        <div
          className={clsx('w-2.5 h-2.5 rounded-full', {
            'bg-gray-900': currentStep >= itemStep && !isLastItem,
            'border border-gray-900': currentStep < itemStep,
            'bg-blue-400': isLastItem && currentStep === itemStep,
          })}
        />
        <span
          className={clsx('text-sm font-semibold ml-4', {
            'text-blue-400': isLastItem && currentStep === itemStep,
            'text-gray-900': !(isLastItem && currentStep === itemStep),
          })}
        >
          <FormattedMessage {...itemText} />
        </span>
      </div>
      <div
        className={clsx('flex flex-col gap-2 mt-2 mb-2', {
          hidden:
            currentStep < itemStep ||
            currentStep >
              (subItems?.[(subItems?.length || 0) - 1]?.itemStep || itemStep),
        })}
      >
        {subItems?.map((subItem) => (
          <WizardSidebarSubItem
            key={`subItem-${subItem.itemStep}`}
            {...subItem}
            subItems={subItems}
            hasActiveMiniItem={latestSubItem?.itemStep === subItem.itemStep}
          />
        ))}
      </div>
    </div>
  );
};

WizardSidebarItem.displayName = displayName;

export default WizardSidebarItem;
