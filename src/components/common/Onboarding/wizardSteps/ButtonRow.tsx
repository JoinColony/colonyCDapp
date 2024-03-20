import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { type PreviousStep } from '~shared/Wizard/types.ts';
import Button from '~v5/shared/Button/index.ts';

interface ButtonRowProps {
  previousStep: PreviousStep;
  showBackButton?: boolean;
}

const displayName = 'common.Onboarding.ButtonRow';

const ButtonRow: FC<ButtonRowProps> = ({
  previousStep,
  showBackButton = true,
}) => {
  const {
    getValues,
    formState: { isSubmitting, isValid },
  } = useFormContext();

  const values = getValues();

  const loading = isSubmitting;

  return (
    <div
      className={clsx(
        'flex pt-12',
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
        disabled={!isValid}
      />
    </div>
  );
};

ButtonRow.displayName = displayName;

export default ButtonRow;
