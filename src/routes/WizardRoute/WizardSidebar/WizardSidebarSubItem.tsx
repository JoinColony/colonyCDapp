import React from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';
import { Optional } from 'utility-types';

import { useWizardContext } from '~context/WizardContext';

import { WizardStep } from './WizardSidebar';

const displayName =
  'routes.WizardRoute.WizardSidebar.WizardSidebarItem.WizardSidebarSubItem';

export type WizardSubStep = Optional<WizardStep, 'subItems' | 'text'>;

interface Props extends WizardSubStep {
  hasActiveMiniStep: boolean;
}

const WizardSidebarSubItem = ({
  id: stepId,
  text: stepText,
  hasActiveMiniStep,
}: Props) => {
  const { currentStep } = useWizardContext();

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
