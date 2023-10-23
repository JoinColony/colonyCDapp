import React from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon';

const displayName = 'frame.Extensions.CreateYourColonySidebar';

const MSG = defineMessages({
  colonyIcon: {
    id: `${displayName}.colonyIcon`,
    defaultMessage: 'Colony',
  },
});

const CreateYourColonySidebar = () => {
  return (
    <nav className="border border-slate-300 rounded-lg p-6 h-full">
      <Icon
        name="colony-icon"
        title={MSG.colonyIcon}
        appearance={{ size: 'large' }}
      />
    </nav>
  );
};

CreateYourColonySidebar.displayName = displayName;

export default CreateYourColonySidebar;
