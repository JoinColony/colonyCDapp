import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Heading from '~shared/Heading';

export const displayName = 'common.CreateUserForm.CreateUserFormHeader';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Create your Colony profile',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Connecting an email address enhances your Colony experience, such as receiving notifications about activity, mentions, and comments.',
  },
});

const CreateUserFormHeader = () => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <Heading
        className="text-2xl mb-2 text-gray-900 font-semibold"
        text={MSG.heading}
      />
      <p className="text-sm text-gray-600">
        <FormattedMessage {...MSG.description} />
      </p>
    </div>
  );
};

CreateUserFormHeader.displayName = displayName;

export default CreateUserFormHeader;
