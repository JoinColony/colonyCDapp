import { CaretRight, CaretLeft } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { useLargeTablet } from '~hooks/index.ts';

import { useEmblaCarouselSettings } from './hooks.ts';
import { CarouselButton } from './partials/CarouselButton.tsx';

interface WidgetCardsListProps {
  className?: string;
}
export const WidgetCardsList: FC<PropsWithChildren<WidgetCardsListProps>> = ({
  children,
  className,
}) => {
  const isLargeTablet = useLargeTablet();

  const {
    emblaRef,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevBtnClick,
    onNextBtnClick,
  } = useEmblaCarouselSettings({
    loop: false,
    slidesToScroll: !isLargeTablet ? 2 : 1,
  });

  return (
    <div className={clsx(className, 'relative flex')}>
      {!prevBtnDisabled && (
        <CarouselButton onClick={onPrevBtnClick} className="left-0 pl-3 pr-6">
          <CaretLeft />
        </CarouselButton>
      )}

      <div className="grow cursor-grab overflow-hidden">
        <div ref={emblaRef}>
          <div className="flex gap-4">{children}</div>
        </div>
      </div>

      {!nextBtnDisabled && (
        <CarouselButton onClick={onNextBtnClick} className="right-0 pl-6 pr-3">
          <CaretRight />
        </CarouselButton>
      )}
    </div>
  );
};
