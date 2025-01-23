import clsx from 'clsx';
import React from 'react';
import { useIntl } from 'react-intl';
import { type TooltipRenderProps } from 'react-joyride';

import { formatText } from '~utils/intl.ts';
import Button, { CloseButton } from '~v5/shared/Button/index.ts';

const TourTooltip: React.FC<TooltipRenderProps> = (props) => {
  const {
    continuous,
    index,
    isLastStep,
    step,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    tooltipProps,
  } = props;

  const { formatMessage } = useIntl();

  let nextButtonText = '';
  let skipButtonText = '';

  skipButtonText = step.data.skipButtonText
    ? step.data.skipButtonText
    : formatMessage({ id: 'tour.skip', defaultMessage: 'Skip' });

  if (continuous) {
    nextButtonText = step.data.nextButtonText
      ? step.data.nextButtonText
      : formatMessage({ id: 'tour.next', defaultMessage: 'Next' });
  } else if (isLastStep) {
    nextButtonText = step.data.nextButtonText
      ? step.data.nextButtonText
      : formatMessage({ id: 'tour.done', defaultMessage: 'Done' });
  } else {
    nextButtonText = step.data.nextButtonText
      ? step.data.nextButtonText
      : formatMessage({ id: 'tour.close', defaultMessage: 'Close' });
  }

  const onClose = () => {
    if (closeProps && closeProps.onClick) {
      closeProps.onClick({
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const { ...restTooltipProps } = tooltipProps;

  return (
    <div
      {...restTooltipProps}
      className={clsx(
        'base relative flex h-full max-h-full w-screen shrink-0 flex-col overflow-hidden bg-base-white shadow-default outline-0 md:h-auto md:w-[30.3125rem] md:rounded-xl md:border md:border-gray-200',
      )}
    >
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        title={formatMessage({ id: 'button.cancel' })}
        onClick={onClose}
        className={clsx(
          `absolute right-4 top-4 text-gray-400 hover:text-gray-600`,
        )}
      />

      {step.data?.image && (
        <div className="mb-4 text-center">
          <img
            src={step.data.image}
            alt={step.data.imageAlt || ''}
            className="inline-block"
          />
        </div>
      )}

      <div className="p-6 text-gray-700">
        {step.data.icon && (
          <span
            className={clsx(
              'mb-4 flex h-[2.5rem] w-[2.5rem] flex-shrink-0 items-center justify-center rounded border border-gray-200 shadow-content',
            )}
          >
            <step.data.icon size={24} />
          </span>
        )}
        {step.title && (
          <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
        )}
        <div className="mb-6 text-md text-gray-700">{step.content}</div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {index > 0 && (
            <Button
              {...backProps}
              mode="primaryOutline"
              text={formatText({ id: 'button.back', defaultMessage: 'Back' })}
              className="flex-grow"
            />
          )}

          {index === 0 && (
            <Button
              {...skipProps}
              mode="primaryOutline"
              text={skipButtonText}
              className="flex-grow"
            />
          )}

          <Button
            {...primaryProps}
            mode="primarySolid"
            text={nextButtonText}
            className="flex-grow"
          />
        </div>
      </div>
    </div>
  );
};

export default TourTooltip;
