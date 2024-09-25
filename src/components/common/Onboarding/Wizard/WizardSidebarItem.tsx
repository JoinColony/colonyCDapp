import clsx from 'clsx';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';

import { type WizardStep } from './types.ts';
import WizardSidebarItemFlowLine from './WizardSidebarItemFlowLine.tsx';
import WizardSidebarSubItem from './WizardSidebarSubItem.tsx';

const displayName = 'routes.WizardRoute.WizardSidebar.WizardSidebarItem';

interface Props extends WizardStep {
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
  const { isDarkMode } = usePageThemeContext();

  const hasSubItems = subItems && subItems.length;

  /* @NOTE: This logic looks menacing, but we are just checking if
   * the current step is between the range of the item's id or subitem's ids. If it is not,
   * we hide the subitems section. */
  const hideSubItems =
    currentStep < stepId || currentStep >= stepId + (subItems?.length || 0);

  const isCompleted =
    (currentStep >= stepId && hasSubItems) ||
    (!hasSubItems && currentStep === stepId);

  return (
    <div className="relative flex flex-col justify-start">
      {!isLastItem && (
        <WizardSidebarItemFlowLine
          currentStep={currentStep}
          stepId={stepId}
          subItems={subItems}
        />
      )}
      <div className="relative flex items-center">
        <div
          className={clsx('h-2.5 w-2.5 rounded-full', {
            'bg-base-white': isCompleted && !isDarkMode,
            'bg-gray-900': isCompleted && isDarkMode,
            'border border-base-white': currentStep < stepId && !isDarkMode,
            'border border-gray-900': currentStep < stepId && isDarkMode,
          })}
        />
        <span
          className={clsx('ml-4 text-sm font-semibold text-base-white', {
            '!text-gray-900': isDarkMode,
          })}
        >
          <FormattedMessage {...stepText} />
        </span>
      </div>
      <div
        className={clsx('mb-2 mt-2 flex flex-col gap-2', {
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
