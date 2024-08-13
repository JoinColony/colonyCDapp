import React from 'react';

import Heading3 from '~shared/Heading/Heading3.tsx';
import Sidebar from '~v5/shared/Navigation/Sidebar/Sidebar.tsx';

import { type WizardProps } from './types.ts';
import WizardSidebarItem from './WizardSidebarItem.tsx';

const displayName = 'common.Onboarding.Wizard.DesktopWizardSidebar';

const DesktopWizardSidebar = ({
  currentStep,
  wizardSteps,
  sidebarTitle,
  sidebarTitleValues,
  enableMobileAndDesktopLayoutBreakpoints,
}: WizardProps) => (
  <Sidebar
    className="!w-[280px] sm:!flex"
    colonySwitcherProps={{
      isLogoButton: true,
      offset: [-20, 226],
      enableMobileAndDesktopLayoutBreakpoints,
    }}
  >
    <div className="px-3 pt-10">
      <Heading3
        appearance={{ theme: 'dark' }}
        className="mb-6 text-xl font-semibold text-base-white"
        text={sidebarTitle}
        textValues={sidebarTitleValues}
      />
      <div className="flex flex-1 flex-col content-between">
        <div className="relative flex flex-1 gap-4">
          <div className="-mt-1 flex flex-col gap-4">
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
                  key={`step-${step.text?.id}`}
                  id={id}
                  isLastItem={index + 1 === wizardSteps.length}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
);

DesktopWizardSidebar.displayName = displayName;

export default DesktopWizardSidebar;
