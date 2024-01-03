import React from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import { Link } from 'react-router-dom';

import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';
import ExternalLink from '~shared/ExternalLink';
import { Heading3 } from '~shared/Heading';
import Icon from '~shared/Icon';
import { UniversalMessageValues } from '~types';

import WizardSidebarItem from './WizardSidebarItem';
import { WizardSidebarSubStep } from './WizardSidebarSubItem';

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
  <nav className="flex flex-col border border-gray-200 rounded-lg p-6 h-full">
    <Link to={LANDING_PAGE_ROUTE} className="w-fit h-fit mb-10">
      <Icon name="colony-icon" appearance={{ size: 'largeSmall' }} />
    </Link>
    <Heading3
      appearance={{ theme: 'dark' }}
      className="text-gray-900 text-xl font-semibold mb-6"
      text={sidebarTitle}
      textValues={sidebarTitleValues}
    />
    <div className="flex flex-col flex-1 content-between">
      <div className="flex flex-1 gap-4 relative">
        <div className="flex flex-col gap-4 -mt-1">
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
        <Icon
          name="question"
          className="mb-1.5 [&>svg]:fill-gray-900"
          appearance={{ size: 'small' }}
        />
        <div className="text-gray-900 text-xs">
          <FormattedMessage {...MSG.guidance} />
        </div>
        <ExternalLink
          href="https://docs.colony.io/"
          className="text-gray-900 hover:text-blue-400 underline text-xs font-medium"
        >
          <FormattedMessage {...MSG.footerLink} />
        </ExternalLink>
      </div>
    </div>
  </nav>
);

WizardSidebar.displayName = displayName;

export default WizardSidebar;
