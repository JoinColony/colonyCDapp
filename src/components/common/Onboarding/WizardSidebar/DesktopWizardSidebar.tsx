import { Question } from '@phosphor-icons/react';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import ExternalLink from '~shared/ExternalLink/index.ts';

import { type WizardSidebarStep } from './WizardSidebar.tsx';
import WizardSidebarItem from './WizardSidebarItem.tsx';

const displayName = 'routes.WizardRoute.WizardSidebar.DesktopWizardSidebar';

const MSG = defineMessages({
  guidance: {
    id: `${displayName}.guidance`,
    defaultMessage: 'Need help and guidance?',
  },
  footerLink: {
    id: `${displayName}.footerLink`,
    defaultMessage: 'Visit our docs',
  },
});

interface Props {
  currentStep: number;
  wizardSteps: WizardSidebarStep[];
}

const DesktopWizardSidebar = ({ currentStep, wizardSteps }: Props) => (
  <div className="flex flex-1 flex-col content-between">
    <div className="relative flex flex-1 gap-4">
      <div className="-mt-1 flex gap-4 sm:flex-col">
        {wizardSteps.map((step, index) => {
          // To work out the current step we add all the previous
          // subitems to the index (the current step count) minus one
          // in order to account the for the containing index of the subitems
          const previousStepSubItemsLength =
            wizardSteps[index - 1]?.subItems?.length || 0;

          const previousStepsCount = previousStepSubItemsLength
            ? previousStepSubItemsLength - 1
            : 0;

          const id = index + previousStepsCount;
          return (
            <WizardSidebarItem
              text={step.text}
              subItems={step.subItems}
              currentStep={currentStep}
              key={`step-${step.text.id}`}
              id={id}
              isLastItem={index + 1 === wizardSteps.length}
            />
          );
        })}
      </div>
    </div>
    <div className="text-sm text-gray-400">
      <Question size={18} className="mb-1.5 [&>svg]:fill-gray-900" />
      <div className="text-xs text-gray-900">
        <FormattedMessage {...MSG.guidance} />
      </div>
      <ExternalLink
        href="https://docs.colony.io/"
        className="text-xs font-medium underline"
      >
        <FormattedMessage {...MSG.footerLink} />
      </ExternalLink>
    </div>
  </div>
);

DesktopWizardSidebar.displayName = displayName;

export default DesktopWizardSidebar;
