import React from 'react';
import { useIntl } from 'react-intl';
import { type TooltipRenderProps } from 'react-joyride';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/Modal.tsx';

const TourTooltip: React.FC<TooltipRenderProps> = ({
  continuous,
  index,
  isLastStep,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}) => {
  const { formatMessage } = useIntl();

  let nextButtonText = '';

  if (continuous) {
    nextButtonText = formatMessage({ id: 'tour.next', defaultMessage: 'Next' });
  } else if (isLastStep) {
    nextButtonText = formatMessage({ id: 'tour.done', defaultMessage: 'Done' });
  } else {
    nextButtonText = formatMessage({
      id: 'tour.close',
      defaultMessage: 'Close',
    });
  }

  const onClose = () => {
    if (closeProps && closeProps.onClick) {
      closeProps.onClick({} as React.MouseEvent<HTMLButtonElement>);
    }
  };

  return (
    <Modal
      isOpen
      icon={step.data.icon}
      onClose={onClose}
      {...tooltipProps}
      withPadding={false}
      withOverlay={false}
    >
      {step.data.image && (
        <div className="mb-4 text-center">
          <img
            src={step.data.image}
            alt={step.data.imageAlt || ''}
            className="inline-block"
          />
        </div>
      )}

      {step.title && (
        <h3 className="mb-2 text-center text-xl font-semibold">{step.title}</h3>
      )}

      <div className="mb-6 text-center text-gray-700">{step.content}</div>

      <div className="flex items-center justify-between">
        {index > 0 && (
          <Button
            {...backProps}
            mode="primaryOutline"
            text={formatText({ id: 'button.back', defaultMessage: 'Back' })}
            isFullSize={false}
          />
        )}

        <div className="flex-1" />

        {!isLastStep && (
          <Button
            {...skipProps}
            mode="primaryOutline"
            text={formatText({ id: 'button.skip', defaultMessage: 'Skip' })}
            isFullSize={false}
          />
        )}

        <Button
          {...primaryProps}
          mode="primarySolid"
          text={nextButtonText}
          isFullSize={false}
        />
      </div>
    </Modal>
  );
};

export default TourTooltip;
