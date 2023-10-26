import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import Button from '~v5/shared/Button';
import { Input } from '~v5/common/Fields';
import { formatText } from '~utils/intl';

import { MAX_USERNAME_LENGTH } from './validation';
import { HeaderRow } from '../CreateColonyWizard/shared';

const displayName = 'common.CreateUserForm';

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
  const {
    register,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useFormContext();

  const emailAddressError = errors.emailAddress?.message as string | undefined;

  const usernameError = errors.username?.message as string | undefined;

  return (
    <>
      <HeaderRow heading={MSG.heading} description={MSG.description} />
      <Input
        name="emailAddress"
        register={register}
        className="w-full text-md border-gray-300 "
        labelMessage={{ id: 'label.email' }}
        isError={!!emailAddressError}
        customErrorMessage={emailAddressError}
        isDisabled={isSubmitting}
      />
      <Input
        name="username"
        register={register}
        className="w-full text-md border-gray-300"
        maxCharNumber={MAX_USERNAME_LENGTH}
        labelMessage={{ id: 'label.username' }}
        isError={!!usernameError}
        customErrorMessage={usernameError}
        isDisabled={isSubmitting}
        shouldNumberOfCharsBeVisible
        successfulMessage={
          dirtyFields.username
            ? formatText({
                id: 'success.userName',
              })
            : undefined
        }
        isDecoratedError={errors.username?.type === 'isUsernameTaken'}
      />
      <Button
        text={{ id: 'button.continue' }}
        type="submit"
        mode="primarySolid"
        disabled={!isValid || isSubmitting}
        className="mt-3"
      />
    </>
  );
};
CreateUserForm.displayName = displayName;

export default CreateUserForm;
