import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import Input from '~v5/common/Fields/Input';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';
import { formatText } from '~utils/intl';

const displayName = 'common.CreateColonyWizard.StepColonyNameInputs';

interface StepColonyNameInputsProps {
  displayName: string;
  colonyName: string;
}

const MSG = defineMessages({
  url: {
    id: `${displayName}.url`,
    defaultMessage: 'Custom Colony URL',
  },
  urlSubLabel: {
    id: `${displayName}.urlSubLabel`,
    defaultMessage:
      'You can change your Colony’s name, but not the URL. Choose carefully.',
  },
  urlSuccess: {
    id: `${displayName}.urlSuccess`,
    defaultMessage: 'URL available',
  },
});

const StepColonyNameInputs = ({
  displayName: wizardDisplayName,
  colonyName: wizardColonyName,
}: StepColonyNameInputsProps) => {
  const {
    register,
    formState: { errors, isSubmitting, dirtyFields, submitCount },
  } = useFormContext();

  const { colonyName: colonyNameDirty } = dirtyFields;

  const showColonyNameMessage = colonyNameDirty && !errors.colonyName?.message;

  const colonyNameSuccessMessage = formatText(MSG.urlSuccess);

  const displayNameError = errors.displayName?.message as string | undefined;
  const showDisplayNameError = Boolean(
    errors.displayName?.type === 'required' && submitCount === 0
      ? false
      : displayNameError,
  );

  const colonyNameError = errors.colonyName?.message as string | undefined;
  const showColonyNameError = Boolean(
    errors.colonyName?.type === 'required' && submitCount === 0
      ? false
      : colonyNameError,
  );

  return (
    <>
      <Input
        name="displayName"
        register={register}
        isError={showDisplayNameError}
        customErrorMessage={displayNameError}
        className="text-md border-gray-300"
        maxCharNumber={MAX_COLONY_DISPLAY_NAME}
        isDisabled={isSubmitting}
        defaultValue={wizardDisplayName}
        labelMessage={{ id: 'colonyName' }}
      />
      <div className="flex flex-col gap-2 pt-6">
        <label className="flex flex-col text-1" htmlFor="id-colonyName">
          {formatText(MSG.url)}
          <span className="text-sm font-normal text-gray-600">
            {formatText(MSG.urlSubLabel)}
          </span>
        </label>
        <div className="relative">
          <div className="text-gray-500 border rounded-s border-gray-300 border-e-0 text-md p-3 absolute">
            app.colony.io/
          </div>
          <Input
            name="colonyName"
            register={register}
            isError={showColonyNameError}
            customErrorMessage={colonyNameError}
            className="text-md border-gray-300 lowercase rounded-s-none ml-[117px] w-[calc(100%-117px)]"
            isDisabled={isSubmitting}
            defaultValue={wizardColonyName}
            maxCharNumber={MAX_COLONY_DISPLAY_NAME}
            successfulMessage={
              showColonyNameMessage && colonyNameSuccessMessage
            }
            isDecoratedError={errors.colonyName?.type === 'isNameTaken'}
          />
        </div>
      </div>
    </>
  );
};

StepColonyNameInputs.displayName = displayName;

export default StepColonyNameInputs;
