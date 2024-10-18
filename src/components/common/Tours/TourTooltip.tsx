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

  skipButtonText = step.data.nextButtonText
    ? step.data.nextButtonText
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
      closeProps.onClick({} as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const { ...restTooltipProps } = tooltipProps;

  return (
    <div
      {...restTooltipProps}
      className={clsx(
        'max-w-lg rounded-lg bg-base-white shadow-lg',
        'flex flex-col',
      )}
    >
      {/* Close Button */}
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        title={formatMessage({ id: 'button.cancel' })}
        onClick={onClose}
        className={clsx(`absolute right-4 text-gray-400 hover:text-gray-600`)}
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

      <div className="mb-6 p-6 text-gray-700">
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
        <div className="mb-6 text-gray-700">{step.content}</div>
        <div className="flex items-center justify-between">
          {index > 0 && (
            <Button
              {...backProps}
              mode="primaryOutline"
              text={formatText({ id: 'button.back', defaultMessage: 'Back' })}
            />
          )}

          {!isLastStep && (
            <Button
              {...skipProps}
              mode="primaryOutline"
              text={skipButtonText}
            />
          )}

          <Button {...primaryProps} mode="primarySolid" text={nextButtonText} />
        </div>
      </div>
    </div>
  );
};

export default TourTooltip;
