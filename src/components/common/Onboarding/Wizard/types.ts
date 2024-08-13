import { type MessageDescriptor } from 'react-intl';

import { type UniversalMessageValues } from '~types';

import { type WizardSidebarSubStep } from './WizardSidebarSubItem.tsx';

export interface WizardStep {
  id: number;
  text: MessageDescriptor;
  subItems?: WizardSidebarSubStep[];
}

export interface WizardProps {
  currentStep: number;
  wizardSteps: WizardStep[];
  sidebarTitle: MessageDescriptor;
  sidebarTitleValues?: UniversalMessageValues;
  enableMobileAndDesktopLayoutBreakpoints?: boolean;
}
