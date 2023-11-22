import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '~v5/common/Fields';
import { formatText } from '~utils/intl';

import { MAX_USERNAME_LENGTH } from './validation';

const displayName = 'common.CreateUserFormInputs';

const CreateUserFormInputs = () => {
  const {
    register,
    formState: { errors, isSubmitting, dirtyFields, submitCount },
  } = useFormContext();
  const emailAddressError = errors.emailAddress?.message as string | undefined;
  const showEmailAddressError = Boolean(
    errors.emailAddress?.type === 'required' && submitCount === 0
      ? false
      : emailAddressError,
  );

  const usernameError = errors.username?.message as string | undefined;
  const showUsernameError = Boolean(
    errors.username?.type === 'required' && submitCount === 0
      ? false
      : usernameError,
  );

  return (
    <>
      <Input
        name="emailAddress"
        register={register}
        className="w-full text-md border-gray-300 "
        labelMessage={{ id: 'label.email' }}
        isError={showEmailAddressError}
        customErrorMessage={emailAddressError}
        isDisabled={isSubmitting}
      />
      <Input
        name="username"
        register={register}
        className="w-full text-md border-gray-300"
        maxCharNumber={MAX_USERNAME_LENGTH}
        labelMessage={{ id: 'label.username' }}
        isError={showUsernameError}
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
    </>
  );
};

CreateUserFormInputs.displayName = displayName;

export default CreateUserFormInputs;
