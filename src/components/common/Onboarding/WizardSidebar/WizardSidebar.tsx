import React from 'react';
import {
  type MessageDescriptor,
  defineMessages,
} from 'react-intl';
import { Link } from 'react-router-dom';

import ColonyIcon from '~icons/ColonyIcon.tsx';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants.ts';
import { Heading3 } from '~shared/Heading/index.ts';
import { type UniversalMessageValues } from '~types/index.ts';

import { type WizardSidebarSubStep } from './WizardSidebarSubItem.tsx';
import { useMobile } from '~hooks';
import DesktopWizardSidebar from './DesktopWizardSidebar.tsx';
import MobileWizardSidebar from './MobileWizardSidebar.tsx';
import { SetStep } from '~shared/Wizard/types.ts';

const displayName = 'routes.WizardRoute.WizardSidebar';

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
  const Stepper = isMobile ? MobileWizardSidebar : DesktopWizardSidebar

  return (
  
    <nav className="flex h-full flex-col rounded-lg border border-gray-200 p-6">
      <Link to={LANDING_PAGE_ROUTE} className="mb-10 h-fit w-fit">
        <ColonyIcon size={36} />
      </Link>
      <Heading3
        appearance={{ theme: 'dark' }}
        className="mb-6 text-xl font-semibold text-gray-900"
        text={sidebarTitle}
        textValues={sidebarTitleValues}
      />
      <Stepper 
        currentStep={currentStep} 
        wizardSteps={wizardSteps}
      />
    </nav>
  )
};

WizardSidebar.displayName = displayName;

export default WizardSidebar;
