import React from 'react';
import { type MessageDescriptor } from 'react-intl';
import { Link } from 'react-router-dom';

import UserNavigationWrapper from '~frame/Extensions/layouts/partials/UserNavigationWrapper/UserNavigationWrapper.tsx';
import { useMobile } from '~hooks';
import ColonyIcon from '~icons/ColonyIcon.tsx';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants.ts';
import { Heading3 } from '~shared/Heading/index.ts';
import { type UniversalMessageValues } from '~types/index.ts';

import DesktopWizardSidebar from './DesktopWizardSidebar.tsx';
import MobileWizardSidebar from './MobileWizardSidebar.tsx';
import { type WizardSidebarSubStep } from './WizardSidebarSubItem.tsx';

const displayName = 'routes.WizardRoute.WizardSidebar';

export interface WizardSidebarStep {
  id: number;
  text: MessageDescriptor;
  subItems?: WizardSidebarSubStep[];
}

interface Props {
  currentStep: number;
  wizardSteps: WizardSidebarStep[];
  sidebarTitle: MessageDescriptor;
  sidebarTitleValues?: UniversalMessageValues;
}

const WizardSidebar = ({
  currentStep,
  sidebarTitle,
  sidebarTitleValues,
  wizardSteps,
}: Props) => {
  const isMobile = useMobile();

  return (
    <>
      <nav className="flex h-full flex-col border border-gray-200 p-6 sm:rounded-lg">
        <div className="relative flex items-center sm:mb-10">
          <Link to={LANDING_PAGE_ROUTE} className="h-fit w-fit">
            <ColonyIcon size={36} />
          </Link>
          {isMobile && <UserNavigationWrapper />}
        </div>
        {!isMobile && (
          <>
            <Heading3
              appearance={{ theme: 'dark' }}
              className="text-xl font-semibold text-gray-900 sm:mb-6"
              text={sidebarTitle}
              textValues={sidebarTitleValues}
            />
            <DesktopWizardSidebar
              currentStep={currentStep}
              wizardSteps={wizardSteps}
            />
          </>
        )}
      </nav>
      {isMobile && (
        <MobileWizardSidebar
          currentStep={currentStep}
          wizardSteps={wizardSteps}
        />
      )}
    </>
  );
};

WizardSidebar.displayName = displayName;

export default WizardSidebar;
