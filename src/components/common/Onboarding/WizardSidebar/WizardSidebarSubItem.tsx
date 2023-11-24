import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';
import { Optional } from 'utility-types';

import { WizardSidebarStep } from './WizardSidebar';

const displayName =
  'routes.WizardRoute.WizardSidebar.WizardSidebarItem.WizardSidebarSubItem';

export type WizardSidebarSubStep = Optional<
  WizardSidebarStep,
  'subItems' | 'text'
>;

interface Props extends WizardSidebarSubStep {
  currentStep: number;
  hasActiveMiniStep: boolean;
}

const WizardSidebarSubItem = ({
  currentStep,
  id: stepId,
  text: stepText,
  hasActiveMiniStep,
}: Props) => {
  if (!stepText) {
    return null;
  }

  return (
    <span
      className={clsx('text-xs ml-[26px]', {
        'text-blue-400 font-semibold':
          currentStep === stepId || hasActiveMiniStep,
      })}
    >
      <FormattedMessage {...stepText} />
    </span>
  );
};

WizardSidebarSubItem.displayName = displayName;

export default WizardSidebarSubItem;
