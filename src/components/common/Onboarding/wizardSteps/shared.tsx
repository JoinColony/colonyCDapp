import React from 'react';
import clsx from 'clsx';
import { MessageDescriptor } from 'react-intl';
import { FieldErrors, FieldValues, useFormContext } from 'react-hook-form';

import Button from '~v5/shared/Button';
import { AnyMessageValues, SimpleMessageValues } from '~types';
import { PreviousStep } from '~shared/Wizard/types';
import { formatText } from '~utils/intl';

interface HeaderRowProps {
  heading: MessageDescriptor | string;
  headingValues?: SimpleMessageValues;
  description: MessageDescriptor | string;
  descriptionValues?: AnyMessageValues;
}

export const HeaderRow = ({
  heading,
  headingValues,
  description,
  descriptionValues,
}: HeaderRowProps) => {
  const headingText =
    typeof heading === 'string'
      ? heading
      : heading && formatText(heading, headingValues);
  const subHeadingText =
    typeof description === 'string'
      ? description
      : description && formatText(description, descriptionValues);

  return (
    <div className="pb-4 border-b border-gray300 mb-8">
      <h3 className="heading-3 pb-2">{headingText}</h3>
      <p className="text-sm text-gray-600">{subHeadingText}</p>
    </div>
  );
};

interface ButtonRowProps {
  previousStep: PreviousStep;
  showBackButton?: boolean;
}

export const ButtonRow = ({
  previousStep,
  showBackButton = true,
}: ButtonRowProps) => {
  const {
    getValues,
    formState: { isSubmitting },
  } = useFormContext();

  const values = getValues();

  const loading = isSubmitting;

  return (
    <div
      className={clsx(
        'pt-12 flex',
        showBackButton ? 'justify-between' : 'justify-end',
      )}
    >
      {showBackButton && (
        <Button
          text={{ id: 'button.back' }}
          textValues={{ loading: 'test' }}
          onClick={() => previousStep(values)}
          loading={loading}
          mode="primaryOutline"
        />
      )}
      <Button
        text={{ id: 'button.continue' }}
        type="submit"
        loading={loading}
        mode="primarySolid"
      />
    </div>
  );
};

export const getInputError = (
  errors: FieldErrors<FieldValues>,
  errorName: string,
  submitCount: number,
) => {
  const error = errors[errorName]?.message as string | undefined;

  const showError = Boolean(
    errors[errorName]?.type === 'required' && submitCount === 0 ? false : error,
  );

  return { error, showError };
};
