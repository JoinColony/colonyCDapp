import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Heading3 } from '~shared/Heading';

import Icon from '~shared/Icon';

const displayName = 'frame.Extensions.CreateYourColonySidebar';

const MSG = defineMessages({
  colonyIcon: {
    id: `${displayName}.colonyIcon`,
    defaultMessage: 'Colony',
  },
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
});

const CreateYourColonySidebar = () => {
  return (
    <nav className="border border-slate-300 rounded-lg p-6 h-full">
      <Icon
        name="colony-icon"
        title={MSG.colonyIcon}
        appearance={{ size: 'large' }}
        className="mb-10"
      />
      <Heading3
        appearance={{ theme: 'dark' }}
        className="text-gray-900 text-xl font-semibold mb-6"
        text={MSG.sidebarTitle}
      />
      <div className="flex gap-4">
        {/* @TODO: Add logic to change height and color of the line, dots, and text depending on the current step */}
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
          <div className="w-px h-14 bg-gray-900" />
          <div className="w-2.5 h-2.5 rounded-full border border-gray-900" />
          <div className="w-px h-6 bg-gray-900" />
          <div className="w-2.5 h-2.5 rounded-full border border-gray-900" />
        </div>
        <div className="flex flex-col gap-4 -mt-1">
          <div className="flex flex-col justify-start mb-2">
            <span className="text-gray-900 text-sm font-semibold mb-2">
              <FormattedMessage {...MSG.account} />
            </span>
            <span className="text-xs font-semibold text-blue-400">
              <FormattedMessage {...MSG.profile} />
            </span>
          </div>
          <div className="flex flex-col justify-start">
            <span className="text-gray-900 text-sm font-semibold">
              <FormattedMessage {...MSG.create} />
            </span>
          </div>
          <div className="flex flex-col justify-start">
            <span className="text-gray-900 text-sm font-semibold">
              <FormattedMessage {...MSG.complete} />
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

CreateYourColonySidebar.displayName = displayName;

export default CreateYourColonySidebar;
