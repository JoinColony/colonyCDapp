import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import WizardSidebarSubItem, {
  WizardSidebarSubStep,
} from './WizardSidebarSubItem';
import { WizardSidebarStep } from './WizardSidebar';
import WizardSidebarItemFlowLine from './WizardSidebarItemFlowLine';

const displayName = 'routes.WizardRoute.WizardSidebar.WizardSidebarItem';

interface Props extends WizardSidebarStep {
  currentStep: number;
  isLastItem: boolean;
}

const getLatestSubItemOnDisplay = (
  currentStepId: number,
  subItems: WizardSidebarSubStep[],
): WizardSidebarSubStep | undefined => {
  const latestSubItem = subItems.find(
    (subItem) => currentStepId - 1 === subItem.id,
  );

  if (!latestSubItem && currentStepId > -1) {
    return getLatestSubItemOnDisplay(currentStepId - 1, subItems);
  }

  return latestSubItem;
};

const WizardSidebarItem = ({
  currentStep,
  id: stepId,
  text: stepText,
  subItems,
  isLastItem,
}: Props) => {
  const isStepOnDisplay = !!subItems?.find((subid) => currentStep === subid.id)
    ?.text;
  const latestSubItem = !isStepOnDisplay
    ? getLatestSubItemOnDisplay(currentStep, subItems || [])
    : undefined;
  const hasSubItems = subItems && subItems.length;

  return (
    <div className="flex flex-col justify-start relative">
      {!isLastItem && (
        <WizardSidebarItemFlowLine
          currentStep={currentStep}
          stepId={stepId}
          subItems={subItems}
        />
      )}
      <div className="flex items-center relative">
        <div
          className={clsx('w-2.5 h-2.5 rounded-full', {
            'bg-gray-900': currentStep >= stepId && hasSubItems,
            'border border-gray-900': currentStep < stepId,
            'bg-blue-400': !hasSubItems && currentStep === stepId,
          })}
        />
        <span
          className={clsx('text-sm font-semibold ml-4', {
            'text-blue-400': !hasSubItems && currentStep === stepId,
            'text-gray-900': hasSubItems && currentStep === stepId,
          })}
        >
          <FormattedMessage {...stepText} />
        </span>
      </div>
      <div
        className={clsx('flex flex-col gap-2 mt-2 mb-2', {
          /*
           * @NOTE: This logic looks menacing, but we are just checking if
           * the current step is between the range of the item's id or subitem's ids. If it is not,
           * we hide the subitems section.
           */
          hidden:
            currentStep < stepId ||
            currentStep >
              (subItems?.[(subItems?.length || 0) - 1]?.id || stepId),
        })}
      >
        {subItems?.map((subItem) => (
          <WizardSidebarSubItem
            currentStep={currentStep}
            key={`subItem-${subItem.id}`}
            {...subItem}
            subItems={subItems}
            hasActiveMiniStep={latestSubItem?.id === subItem.id}
          />
        ))}
      </div>
    </div>
  );
};

WizardSidebarItem.displayName = displayName;

export default WizardSidebarItem;
