import { Question } from '@phosphor-icons/react';
import React from 'react';
import {
  FormattedMessage,
  type MessageDescriptor,
  defineMessages,
} from 'react-intl';
import { Link } from 'react-router-dom';

import ColonyIcon from '~icons/ColonyIcon.tsx';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { Heading3 } from '~shared/Heading/index.ts';
import { type UniversalMessageValues } from '~types/index.ts';

import WizardSidebarItem from './WizardSidebarItem.tsx';
import { type WizardSidebarSubStep } from './WizardSidebarSubItem.tsx';

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
}: Props) => (
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
          className="text-xs font-medium text-gray-900 underline hover:text-blue-400"
        >
          <FormattedMessage {...MSG.footerLink} />
        </ExternalLink>
      </div>
    </div>
  </nav>
);

WizardSidebar.displayName = displayName;

export default WizardSidebar;
