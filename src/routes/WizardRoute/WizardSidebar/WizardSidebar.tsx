import React from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';

import ExternalLink from '~shared/ExternalLink';
import { Heading3 } from '~shared/Heading';

import Icon from '~shared/Icon';

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

const WizardSidebar = ({ sidebarTitle, wizardSteps }: Props) => (
  <nav className="flex flex-col border border-slate-300 rounded-lg p-6 h-full">
    <Icon name="colony-icon" appearance={{ size: 'large' }} className="mb-10" />
    <Heading3
      appearance={{ theme: 'dark' }}
      className="text-gray-900 text-xl font-semibold mb-6"
      text={sidebarTitle}
    />
    <div className="flex flex-col flex-1 content-between">
      <div className="flex flex-1 gap-4 relative">
        <div className="flex flex-col gap-4 -mt-1">
          {wizardSteps.map((step, i) => (
            <WizardSidebarItem
              key={`step-${step.itemStep}`}
              {...step}
              isLastItem={i + 1 === wizardSteps.length}
            />
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-400">
        <Icon name="question" className="mb-1.5 [&>svg]:fill-gray-900" />
        <div className="text-gray-900">
          <FormattedMessage {...MSG.guidance} />
        </div>
        <ExternalLink href="https://docs.colony.io/" className="text-gray-900">
          <FormattedMessage {...MSG.footerLink} />
        </ExternalLink>
      </div>
    </div>
  </nav>
);

WizardSidebar.displayName = displayName;

export default WizardSidebar;
