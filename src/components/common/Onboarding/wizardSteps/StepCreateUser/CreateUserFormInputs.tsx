import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '~v5/common/Fields';
import { formatText } from '~utils/intl';

import { getInputError } from '../shared';

import { MAX_USERNAME_LENGTH } from './validation';

const displayName = 'common.CreateUserFormInputs';

const CreateUserFormInputs = () => {
  const {
    register,
    formState: { errors, isSubmitting, dirtyFields, submitCount },
  } = useFormContext();

  const { error: emailAddressError, showError: showEmailAddressError } =
    getInputError(errors, 'emailAddress', submitCount);

  const { error: usernameError, showError: showUsernameError } = getInputError(
    errors,
    'username',
    submitCount,
  );

  return (
    <div className="w-full">
      <div className="pb-6">
        <Input
          name="emailAddress"
          register={register}
          className="w-full text-md border-gray-300"
          labelMessage={{ id: 'label.email' }}
          isError={showEmailAddressError}
          customErrorMessage={emailAddressError}
          isDisabled={isSubmitting}
        />
      </div>
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
    </div>
  );
};

CreateUserFormInputs.displayName = displayName;

export default CreateUserFormInputs;
