import clsx from 'clsx';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { WizardSidebarStep } from './WizardSidebar.tsx';
import WizardSidebarItemFlowLine from './WizardSidebarItemFlowLine.tsx';
import WizardSidebarSubItem from './WizardSidebarSubItem.tsx';

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

  /* @NOTE: This logic looks menacing, but we are just checking if
   * the current step is between the range of the item's id or subitem's ids. If it is not,
   * we hide the subitems section. */
  const hideSubItems =
    currentStep < stepId || currentStep >= stepId + (subItems?.length || 0);

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
        {subItems?.map((subItem, index) => {
          const activatePrevious =
            currentStep === stepId + index + 1 &&
            subItems[index + 1]?.text === undefined;
          const activateCurrent = currentStep === stepId + index;

          if (subItem.text === undefined) {
            return null;
          }

          return (
            <WizardSidebarSubItem
              key={`subItem-${stepId + index}`}
              text={subItem.text}
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
