import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import { useColonyCreationFlowContext } from '../WizardLayout';
import { WizardStep } from './WizardSidebar';

const displayName =
  'routes.WizardRoute.WizardSidebar.WizardSidebarItem.WizardSidebarSubItem';

export type WizardSubStep = Exclude<WizardStep, 'subItem'>;

const WizardSidebarSubItem = ({ itemStep, itemText }: WizardSubStep) => {
  const { currentStep } = useColonyCreationFlowContext();

  return (
    <span
      className={clsx('text-xs', {
        'text-blue-400 font-semibold': currentStep === itemStep,
      })}
    >
      <FormattedMessage {...itemText} />
    </span>
  );
};

WizardSidebarSubItem.displayName = displayName;

export default WizardSidebarSubItem;
