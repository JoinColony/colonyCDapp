import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { MAX_COLONY_DISPLAY_NAME } from '~constants/index.ts';
import { formatText } from '~utils/intl.ts';
import Input from '~v5/common/Fields/Input/index.ts';

import { getInputError } from '../shared.tsx';

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

  const { error: displayNameError, showError: showDisplayNameError } =
    getInputError(errors, 'displayName', submitCount);
  const { error: colonyNameError, showError: showColonyNameError } =
    getInputError(errors, 'colonyName', submitCount);

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
        shouldFocus
      />
      <div className="flex flex-col gap-2 pt-6">
        <label className="flex flex-col text-1" htmlFor="id-colonyName">
          {formatText(MSG.url)}
          <span className="text-sm font-normal text-gray-600">
            {formatText(MSG.urlSubLabel)}
          </span>
        </label>
        <div className="flex">
          <div className="text-gray-500 border rounded-s border-gray-300 border-e-0 text-md p-3">
            {process.env.HOST}/
          </div>
          <div className="grow">
            <Input
              name="colonyName"
              register={register}
              isError={showColonyNameError}
              customErrorMessage={colonyNameError}
              className="text-md border-gray-300 lowercase rounded-s-none"
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
      </div>
    </>
  );
};

StepColonyNameInputs.displayName = displayName;

export default StepColonyNameInputs;
