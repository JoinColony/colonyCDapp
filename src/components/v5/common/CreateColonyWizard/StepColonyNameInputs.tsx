import React from 'react';
import { useFormContext } from 'react-hook-form';

import Input from '~v5/common/Fields/Input';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';

const displayName = 'common.CreateColonyWizard.StepColonyNameInputs';

const StepColonyNameInputs = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    getValues,
  } = useFormContext();

  const displayNameDefault = getValues('displayName');
  const displayNameError = errors.displayName?.message as string | undefined;

  const colonyNameDefault = getValues('colonyName');
  const colonyNameError = errors.colonyName?.message as string | undefined;

  return (
    <div className="flex flex-col gap-12 pt-8">
      <Input
        name="displayName"
        register={register}
        isError={!!displayNameError}
        customErrorMessage={displayNameError}
        className="text-md border-gray-300"
        maxCharNumber={MAX_COLONY_DISPLAY_NAME}
        isDisabled={isSubmitting}
        defaultValue={displayNameDefault}
        labelMessage={{ id: 'colonyName' }}
      />
      <Input
        name="colonyName"
        register={register}
        isError={!!colonyNameError}
        customErrorMessage={colonyNameError}
        className="text-md border-gray-300 lowercase"
        isDisabled={isSubmitting}
        defaultValue={colonyNameDefault}
        maxCharNumber={MAX_COLONY_DISPLAY_NAME}
        labelMessage={{ id: 'createColonyWizard.step.colonyName.url' }}
        subLabelMessage={{
          id: 'createColonyWizard.step.colonyName.urlSubLabel',
        }}
      />
    </div>
  );
};

StepColonyNameInputs.displayName = displayName;

export default StepColonyNameInputs;
