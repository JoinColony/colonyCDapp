import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';

import { formatMessage } from '~utils/yup/tests/helpers.ts';

import { images } from './consts.ts';
import { useEmblaCarouselSettings } from './hooks.ts';
import DotButton from './partials/DotButton.tsx';
import { type ImageCarouselProps } from './types.ts';

const displayName = 'common.Extensions.ImageCarousel';

const ImageCarousel: FC<ImageCarouselProps> = ({
  slideUrls = images,
  slideWrapperClassName,
  slideImageClassName,
  options = { loop: true, align: 'start' },
  isAutoplay = false,
  isChangeSlideDotButton = true,
  setSelectedIndex,
  className,
}) => {
  const { scrollSnaps, emblaRef, scrollTo, selectedIndex } =
    useEmblaCarouselSettings(options, isAutoplay);

  useEffect(() => {
    setSelectedIndex?.(selectedIndex);
  }, [selectedIndex]);

  return (
    <div className={clsx(className, 'relative pb-[1.75rem]')}>
      <div className="cursor-grab overflow-hidden">
        <div ref={emblaRef}>
          <div className="flex">
            {slideUrls.map((url) => (
              <div
                className={
                  slideWrapperClassName ??
                  'min-w-full sm:mr-4 sm:w-[31.875rem] sm:min-w-[31.875rem]'
                }
                key={url}
              >
                <img
                  alt="file"
                  src={url}
                  className={
                    slideImageClassName ??
                    'aspect-[380/248] w-full object-cover sm:aspect-[510/248]'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 m-0 flex w-full justify-center">
        {scrollSnaps.map((_, index) =>
          isChangeSlideDotButton ? (
            <DotButton
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onClick={() => scrollTo(index)}
              className={clsx(
                'mx-1 h-2 w-2 cursor-pointer rounded-full bg-gray-200 transition-all duration-normal hover:bg-blue-400',
                {
                  'bg-gray-500': index === selectedIndex,
                },
              )}
            />
          ) : (
            <button
              type="button"
              aria-label={formatMessage({ id: 'ariaLabel.changeSlide' })}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onClick={() => scrollTo(index)}
              className="group my-[-10px] py-[10px]"
            >
              <div
                className={clsx(
                  'mx-1 mx-[.3125rem] h-2 h-[.1875rem] w-2 w-[5.875rem] cursor-pointer rounded-full bg-gray-200 transition-all duration-normal group-hover:bg-blue-400',
                  {
                    'bg-gray-500': index === selectedIndex,
                  },
                )}
              />
            </button>
          ),
        )}
      </div>
    </div>
  );
};

ImageCarousel.displayName = displayName;

export default ImageCarousel;
