import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';

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

  // @TODO current breakpoints are too large. Refactor this when fixing breakpoints
  const isMobile = useMediaQuery({ query: '(max-width: 540px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  const loading = isSubmitting;

  return (
    <div className="pt-32 sm:pt-12">
      <div
        className={clsx({
          'fixed bottom-0 left-0 right-0 w-full border-t border-gray-100 bg-base-white py-6':
            isMobile || isTablet,
        })}
      >
        <div
          className={clsx(
            'flex max-w-lg flex-col-reverse gap-2 sm:flex-row sm:gap-0',
            showBackButton ? 'justify-between' : 'justify-end',
            {
              'px-6': isMobile,
              'mx-auto': isMobile || isTablet,
            },
          )}
        >
          {showBackButton && (
            <Button
              text={{ id: 'button.back' }}
              textValues={{ loading: 'test' }}
              onClick={() => previousStep(values)}
              loading={loading}
              mode="primaryOutline"
              isFullSize={isMobile}
            />
          )}
          <Button
            text={{ id: 'button.continue' }}
            type="submit"
            loading={loading}
            mode="primarySolid"
            disabled={!isValid}
            isFullSize={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

ButtonRow.displayName = displayName;

export default ButtonRow;
