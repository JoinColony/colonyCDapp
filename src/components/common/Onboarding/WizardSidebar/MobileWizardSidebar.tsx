import React from 'react';
import { FormattedMessage } from 'react-intl';

import { type WizardSidebarStep } from './WizardSidebar.tsx'
import Stepper from '~v5/shared/Stepper/Stepper.tsx';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

const displayName = 'routes.WizardRoute.WizardSidebar';

interface Props {
    currentStep: number;
    wizardSteps: WizardSidebarStep[];
}

const MobileWizardSidebar = ({
    currentStep,
    wizardSteps,
}: Props) => {

    const steps: StepperItem<number>[] = [];
    let stepsCount = 0;

    wizardSteps.forEach((step) => {
        if (step.subItems) {
            steps.push(...step.subItems.map((subItem) => {

                let newStep;

                if (subItem.text) {
                    newStep = {
                        key: stepsCount,
                        heading: {
                            label: <FormattedMessage {...subItem.text} />
                        }
                    }
                }

                stepsCount++;

                return newStep;
            }))
        } else {
            steps.push({
                key: stepsCount,
                heading: {
                    label: <FormattedMessage {...step.text} />
                }
            })
            stepsCount++;
        }
    })

    const isPreviousStepActive = currentStep > 0 && !steps[currentStep];

    const activeStepKey = isPreviousStepActive ? currentStep - 1 : currentStep;

    return (
        <Stepper
            activeStepKey={activeStepKey}
            items={steps.filter(step => !!step)}
        />
    );
};

MobileWizardSidebar.displayName = displayName;

export default MobileWizardSidebar;
