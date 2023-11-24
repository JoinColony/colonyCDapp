import React from 'react';
import { MessageDescriptor } from 'react-intl';
import { useFormContext } from 'react-hook-form';

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
      <h3 className="heading-3 pb-1">{headingText}</h3>
      <p className="text-sm text-gray-600">{subHeadingText}</p>
    </div>
  );
};

interface ButtonRowProps {
  previousStep: PreviousStep;
  continueButtonDisableOverride?: boolean;
}

export const ButtonRow = ({
  previousStep,
  continueButtonDisableOverride,
}: ButtonRowProps) => {
  const {
    getValues,
    formState: { isValid, isSubmitting },
  } = useFormContext();

  const values = getValues();

  const disabled =
    continueButtonDisableOverride !== undefined
      ? continueButtonDisableOverride
      : !isValid || isSubmitting;

  const loading = isSubmitting;

  return (
    <div className="pt-12 flex justify-between">
      <Button
        text={{ id: 'button.back' }}
        textValues={{ loading: 'test' }}
        onClick={() => previousStep(values)}
        loading={loading}
        mode="primaryOutline"
      />
      <Button
        text={{ id: 'button.continue' }}
        type="submit"
        disabled={disabled}
        loading={loading}
        mode="primarySolid"
      />
    </div>
  );
};
