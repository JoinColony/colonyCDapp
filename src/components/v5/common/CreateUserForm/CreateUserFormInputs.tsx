import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '~v5/common/Fields';
import { formatText } from '~utils/intl';

import { MAX_USERNAME_LENGTH } from './validation';

const displayName = 'common.CreateUserFormInputs';

const CreateUserFormInputs = () => {
  const {
    register,
    formState: { errors, isSubmitting, dirtyFields },
  } = useFormContext();
  const emailAddressError = errors.emailAddress?.message as string | undefined;
  const usernameError = errors.username?.message as string | undefined;
  return (
    <>
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
    </>
  );
};

CreateUserFormInputs.displayName = displayName;

export default CreateUserFormInputs;
