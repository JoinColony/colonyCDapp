import React from 'react';
import { useFormContext } from 'react-hook-form';

import Button from '~v5/shared/Button';
import { Input } from '~v5/common/Fields';
import { formatText } from '~utils/intl';

import CreateUserFormHeader from './CreateUserFormHeader';
import { MAX_USERNAME_LENGTH } from './validation';

const displayName = 'common.CreateUserForm';

const CreateUserForm = () => {
  const {
    register,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useFormContext();

  const emailAddressError = errors.emailAddress?.message as string | undefined;

  const usernameError = errors.username?.message as string | undefined;

  return (
    <>
      <CreateUserFormHeader />
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
        mode="solidBlack"
        disabled={!isValid || isSubmitting}
        className="mt-12"
      />
    </>
  );
};
CreateUserForm.displayName = displayName;

export default CreateUserForm;
