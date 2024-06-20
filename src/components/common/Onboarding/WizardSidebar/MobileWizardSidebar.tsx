import React from 'react';
import { FormattedMessage } from 'react-intl';

import Stepper from '~v5/shared/Stepper/Stepper.tsx';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import { type WizardSidebarStep } from './WizardSidebar.tsx';

const displayName = 'routes.WizardRoute.WizardSidebar.MobileWizardSidebar';

interface Props {
  currentStep: number;
  wizardSteps: WizardSidebarStep[];
}

const MobileWizardSidebar = ({ currentStep, wizardSteps }: Props) => {
  const steps: StepperItem<number>[] = [];
  let stepsCount = 0;

  wizardSteps.forEach((step) => {
    if (step.subItems) {
      steps.push(
        ...step.subItems.map((subItem) => {
          let newStep;

          if (subItem.text) {
            newStep = {
              key: stepsCount,
              heading: {
                label: <FormattedMessage {...subItem.text} />,
              },
            };
          }

          stepsCount += 1;

          return newStep;
        }),
      );
    } else {
      steps.push({
        key: stepsCount,
        heading: {
          label: <FormattedMessage {...step.text} />,
        },
      });
      stepsCount += 1;
    }
  });

  const isPreviousStepActive = currentStep > 0 && !steps[currentStep];

  const activeStepKey = isPreviousStepActive ? currentStep - 1 : currentStep;

  return (
    <div className="border-b border-gray-200 bg-base-bg px-6 py-[18px]">
      <Stepper
        activeStepKey={activeStepKey}
        items={steps.filter((step) => !!step)}
      />
    </div>
  );
};

MobileWizardSidebar.displayName = displayName;

export default MobileWizardSidebar;
