import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import clsx from 'clsx';
import ExternalLink from '~shared/ExternalLink';
import { Heading3 } from '~shared/Heading';

import Icon from '~shared/Icon';

import { useColonyCreationFlowContext } from './WizardLayout';

const displayName = 'frame.Extensions.CreateYourColonySidebar';

const MSG = defineMessages({
  sidebarTitle: {
    id: `${displayName}.sidebarTitle`,
    defaultMessage: 'Create your new Colony',
  },
  account: {
    id: `${displayName}.account`,
    defaultMessage: 'Account',
  },
  profile: {
    id: `${displayName}.profile`,
    defaultMessage: 'Profile',
  },
  create: {
    id: `${displayName}.create`,
    defaultMessage: 'Create',
  },
  complete: {
    id: `${displayName}.complete`,
    defaultMessage: 'Complete',
  },
  guidance: {
    id: `${displayName}.guidance`,
    defaultMessage: 'Need help and guidance?',
  },
  footerLink: {
    id: `${displayName}.footerLink`,
    defaultMessage: 'Visit our docs',
  },
  details: {
    id: `${displayName}.details`,
    defaultMessage: 'Details',
  },
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native Token',
  },
  confirmation: {
    id: `${displayName}.confirmation`,
    defaultMessage: 'Confirmation',
  },
});

const CreateYourColonySidebar = () => {
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
        text={MSG.sidebarTitle}
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
            <div
              className={clsx('flex flex-col justify-start', {
                'mb-2': currentStep === 0,
              })}
            >
              <span
                className={clsx('text-gray-900 text-sm font-semibold', {
                  'mb-2': currentStep === 0,
                })}
              >
                <FormattedMessage {...MSG.account} />
              </span>
              <span
                className={clsx('text-xs font-semibold', {
                  'text-blue-400': currentStep === 0,
                  hidden: currentStep !== 0,
                })}
              >
                <FormattedMessage {...MSG.profile} />
              </span>
            </div>
            <div className="flex flex-col justify-start">
              <span className="text-gray-900 text-sm font-semibold">
                <FormattedMessage {...MSG.create} />
              </span>
              <div
                className={clsx('flex flex-col gap-2 mt-2 mb-4', {
                  hidden: currentStep < 1 || currentStep > 3,
                })}
              >
                <span
                  className={clsx('text-xs', {
                    'text-blue-400 font-semibold': currentStep === 1,
                  })}
                >
                  <FormattedMessage {...MSG.details} />
                </span>
                <span
                  className={clsx('text-xs', {
                    'text-blue-400 font-semibold': currentStep === 2,
                  })}
                >
                  <FormattedMessage {...MSG.nativeToken} />
                </span>
                <span
                  className={clsx('text-xs', {
                    'text-blue-400 font-semibold': currentStep === 3,
                  })}
                >
                  <FormattedMessage {...MSG.confirmation} />
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-start">
              <span
                className={clsx('text-sm font-semibold', {
                  'text-gray-900': currentStep !== 4,
                  'text-blue-400': currentStep === 4,
                })}
              >
                <FormattedMessage {...MSG.complete} />
              </span>
            </div>
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

CreateYourColonySidebar.displayName = displayName;

export default CreateYourColonySidebar;
