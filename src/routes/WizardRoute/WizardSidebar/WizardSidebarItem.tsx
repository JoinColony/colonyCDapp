import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import { useColonyCreationFlowContext } from '../WizardLayout';

import WizardSidebarSubItem from './WizardSidebarSubItem';
import { WizardStep } from './WizardSidebar';

const displayName = 'routes.WizardRoute.WizardSidebar.WizardSidebarItem';

interface Props extends WizardStep {
  isLastItem: boolean;
}

const WizardSidebarItem = ({
  itemStep,
  itemText,
  subItems,
  isLastItem,
}: Props) => {
  const { currentStep } = useColonyCreationFlowContext();

  return (
    <div className="flex flex-col justify-start">
      <span
        className={clsx('text-gray-900 text-sm font-semibold', {
          'text-blue-400': isLastItem && currentStep === itemStep,
        })}
      >
        <FormattedMessage {...itemText} />
      </span>
      <div
        className={clsx('flex flex-col gap-2 mt-2 mb-4', {
          hidden:
            currentStep < itemStep - 1 ||
            currentStep > itemStep + (subItems?.length || 0) - 1,
        })}
      >
        {subItems?.map((subItem) => (
          <WizardSidebarSubItem {...subItem} />
        ))}
      </div>
    </div>
  );
};

WizardSidebarItem.displayName = displayName;

export default WizardSidebarItem;
