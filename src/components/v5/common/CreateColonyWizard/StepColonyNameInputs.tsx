import React from 'react';
import { useFormContext } from 'react-hook-form';

import Input from '~v5/common/Fields/Input';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';
import { formatText } from '~utils/intl';

const displayName = 'common.CreateColonyWizard.StepColonyNameInputs';

interface StepColonyNameInputsProps {
  displayName: string;
  colonyName: string;
}

const StepColonyNameInputs = ({
  displayName: wizardDisplayName,
  colonyName: wizardColonyName,
}: StepColonyNameInputsProps) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const displayNameError = errors.displayName?.message as string | undefined;

  const colonyNameError = errors.colonyName?.message as string | undefined;

  return (
    <div className="flex flex-col gap-12">
      <Input
        name="displayName"
        register={register}
        isError={!!displayNameError}
        customErrorMessage={displayNameError}
        className="text-md border-gray-300"
        maxCharNumber={MAX_COLONY_DISPLAY_NAME}
        isDisabled={isSubmitting}
        defaultValue={wizardDisplayName}
        labelMessage={{ id: 'colonyName' }}
      />
      <div className="flex flex-col gap-1">
        <label className="flex flex-col text-1" htmlFor="colonyName">
          {formatText({ id: 'createColonyWizard.step.colonyName.url' })}
          <span className="text-xs text-gray-400">
            {formatText({
              id: 'createColonyWizard.step.colonyName.urlSubLabel',
            })}
          </span>
        </label>
        <div className="flex items-center">
          <span className="mb-9 text-gray-500 border rounded-s border-gray-300 border-e-0 text-md p-3">
            app.colony.io/
          </span>
          <Input
            name="colonyName"
            register={register}
            isError={!!colonyNameError}
            customErrorMessage={colonyNameError}
            className="text-md border-gray-300 lowercase rounded-s-none"
            isDisabled={isSubmitting}
            defaultValue={wizardColonyName}
            maxCharNumber={MAX_COLONY_DISPLAY_NAME}
          />
        </div>
      </div>
    </div>
  );
};

StepColonyNameInputs.displayName = displayName;

export default StepColonyNameInputs;
