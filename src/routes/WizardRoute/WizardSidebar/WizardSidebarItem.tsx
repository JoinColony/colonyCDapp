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
  currentStepId: number,
  subItems: WizardSubStep[],
): WizardSubStep | undefined => {
  const latestSubItem = subItems.find(
    (subItem) => currentStepId - 1 === subItem.id,
  );

  if (!latestSubItem && currentStepId > -1) {
    return getLatestSubItemOnDisplay(currentStepId - 1, subItems);
  }

  return latestSubItem;
};

const WizardSidebarItem = ({
  id: stepId,
  text: stepText,
  subItems,
  isLastItem,
}: Props) => {
  const { currentStep } = useWizardContext();
  const isStepOnDisplay = !!subItems?.find((subid) => currentStep === subid.id)
    ?.text;
  const latestSubItem = !isStepOnDisplay
    ? getLatestSubItemOnDisplay(currentStep, subItems || [])
    : undefined;

  return (
    <div className="flex flex-col justify-start relative">
      {!isLastItem && (
        <WizardSidebarItemFlowLine stepId={stepId} subItems={subItems} />
      )}
      <div className="flex items-center relative">
        <div
          className={clsx('w-2.5 h-2.5 rounded-full', {
            'bg-gray-900': currentStep >= stepId && !isLastItem,
            'border border-gray-900': currentStep < stepId,
            'bg-blue-400': isLastItem && currentStep === stepId,
          })}
        />
        <span
          className={clsx('text-sm font-semibold ml-4', {
            'text-blue-400': isLastItem && currentStep === stepId,
            'text-gray-900': !(isLastItem && currentStep === stepId),
          })}
        >
          <FormattedMessage {...stepText} />
        </span>
      </div>
      {/*
       * @NOTE: This logic looks menacing, but we are just checking if
       * the current step is between the range of the item's id or subitem's ids. If it is not,
       * we hide the subitems section.
       */}
      <div
        className={clsx('flex flex-col gap-2 mt-2 mb-2', {
          hidden:
            currentStep < stepId ||
            currentStep >
              (subItems?.[(subItems?.length || 0) - 1]?.id || stepId),
        })}
      >
        {subItems?.map((subItem) => (
          <WizardSidebarSubItem
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
