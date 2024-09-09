import { CaretRight, CaretLeft } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { useEmblaCarouselSettings } from './hooks.ts';
import { CarouselButton } from './partials/CarouselButton.tsx';

interface WidgetCardsListProps {
  className?: string;
}
export const WidgetCardsList: FC<PropsWithChildren<WidgetCardsListProps>> = ({
  children,
  className,
}) => {
  const {
    emblaRef,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = useEmblaCarouselSettings({ loop: false, align: 'start' });

  const isBothBtnsDisabled = prevBtnDisabled && nextBtnDisabled;

  return (
    <div className={clsx(className, 'relative flex')}>
      {!isBothBtnsDisabled && (
        <CarouselButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
          <CaretLeft />
        </CarouselButton>
      )}

      <div
        className={clsx('grow cursor-grab overflow-hidden', {
          'mx-4': !isBothBtnsDisabled,
        })}
      >
        <div ref={emblaRef}>
          <div className="flex gap-2">{children}</div>
        </div>
      </div>

      {!isBothBtnsDisabled && (
        <CarouselButton onClick={onNextButtonClick} disabled={nextBtnDisabled}>
          <CaretRight />
        </CarouselButton>
      )}
    </div>
  );
};
