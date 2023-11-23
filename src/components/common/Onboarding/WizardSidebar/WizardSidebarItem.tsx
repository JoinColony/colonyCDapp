import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import WizardSidebarSubItem from './WizardSidebarSubItem';
import { WizardSidebarStep } from './WizardSidebar';
import WizardSidebarItemFlowLine from './WizardSidebarItemFlowLine';

const displayName = 'routes.WizardRoute.WizardSidebar.WizardSidebarItem';

interface Props extends WizardSidebarStep {
  currentStep: number;
  isLastItem: boolean;
}

const WizardSidebarItem = ({
  currentStep,
  id: stepId,
  text: stepText,
  subItems,
  isLastItem,
}: Props) => {
  const hasSubItems = subItems && subItems.length;

  const hideSubItems = currentStep >= stepId + (subItems?.length || 0);

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
          className={clsx(
            'text-sm font-semibold ml-4',
            currentStep === stepId && !hasSubItems
              ? 'text-blue-400'
              : 'text-gray-900',
          )}
        >
          <FormattedMessage {...stepText} />
        </span>
      </div>
      <div
        className={clsx('flex flex-col gap-2 mt-2 mb-2', {
          hidden: hideSubItems,
        })}
      >
        {subItems?.map((subItem, i) => {
          const activatePrevious =
            currentStep === stepId + i + 1 &&
            subItems[i + 1]?.text === undefined;
          const activateCurrent = currentStep === stepId + i;

          return (
            <WizardSidebarSubItem
              currentStep={currentStep}
              key={`subItem-${stepId + i}`}
              {...subItem}
              subItems={subItems}
              isActive={activateCurrent || activatePrevious}
            />
          );
        })}
      </div>
    </div>
  );
};

WizardSidebarItem.displayName = displayName;

export default WizardSidebarItem;
