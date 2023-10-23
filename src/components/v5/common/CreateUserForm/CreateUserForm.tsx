import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Form } from '~shared/Fields';
import Heading from '~shared/Heading';

export const displayName = 'common.CreateUserForm';

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

const CreateUserForm = () => {
  return (
    <Form
      className="max-w-lg border-b border-gray-200 pb-4"
      defaultValues={{
        username: '',
        email: '',
      }}
      onSubmit={() => ({})}
    >
      <Heading
        className="text-2xl mb-2 text-gray-900 font-semibold"
        text={MSG.heading}
      />
      <p className="text-sm text-gray-600">
        <FormattedMessage {...MSG.description} />
      </p>
    </Form>
  );
};
CreateUserForm.displayName = displayName;

export default CreateUserForm;
