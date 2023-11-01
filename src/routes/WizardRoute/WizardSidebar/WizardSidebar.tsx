import React from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';

import clsx from 'clsx';
import ExternalLink from '~shared/ExternalLink';
import { Heading3 } from '~shared/Heading';

import Icon from '~shared/Icon';

import { useColonyCreationFlowContext } from '../WizardLayout';
import WizardSidebarItem from './WizardSidebarItem';
import { WizardSubStep } from './WizardSidebarSubItem';

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

export interface WizardStep {
  itemStep: number;
  itemText: MessageDescriptor;
  subItems?: WizardSubStep[];
}

interface Props {
  wizardSteps: WizardStep[];
  sidebarTitle: MessageDescriptor;
}

const WizardSidebar = ({ sidebarTitle, wizardSteps }: Props) => {
  const { currentStep } = useColonyCreationFlowContext();

  return (
    <nav className="flex flex-col border border-slate-300 rounded-lg p-6 h-full">
      <Icon
        name="colony-icon"
        appearance={{ size: 'large' }}
        className="mb-10"
      />
      <Heading3
        appearance={{ theme: 'dark' }}
        className="text-gray-900 text-xl font-semibold mb-6"
        text={sidebarTitle}
      />
      <div className="flex flex-col flex-1 content-between">
        <div className="flex flex-1 gap-4">
          <div className="flex flex-col items-center">
            <div
              className={clsx('w-2.5 h-2.5 rounded-full', {
                'bg-gray-900': currentStep >= 0,
              })}
            />
            <div
              className={clsx('w-px bg-gray-900', {
                'h-14': currentStep === 0,
                'h-6': currentStep !== 0,
              })}
            />
            <div
              className={clsx('w-2.5 h-2.5 rounded-full', {
                'bg-gray-900': currentStep >= 1,
                'border border-gray-900': currentStep < 1,
              })}
            />
            <div
              className={clsx('w-px bg-gray-900', {
                'h-28': currentStep >= 1 && currentStep < 4,
                'h-6': currentStep < 1 || currentStep > 3,
              })}
            />
            <div
              className={clsx('w-2.5 h-2.5 rounded-full', {
                'bg-blue-400': currentStep >= 4,
                'border border-gray-900': currentStep < 4,
              })}
            />
          </div>
          <div className="flex flex-col gap-4 -mt-1">
            {wizardSteps.map((step) => (
              <WizardSidebarItem
                {...step}
                isLastItem={step.itemStep === wizardSteps.length - 1}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <Icon name="question" className="mb-1.5 [&>svg]:fill-gray-900" />
          <div className="text-gray-900">
            <FormattedMessage {...MSG.guidance} />
          </div>
          <ExternalLink
            href="https://docs.colony.io/"
            className="text-gray-900"
          >
            <FormattedMessage {...MSG.footerLink} />
          </ExternalLink>
        </div>
      </div>
    </nav>
  );
};

WizardSidebar.displayName = displayName;

export default WizardSidebar;
