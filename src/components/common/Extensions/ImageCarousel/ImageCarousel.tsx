import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';

import { images } from './consts.ts';
import { useEmblaCarouselSettings } from './hooks.ts';
import DotButton from './partials/DotButton.tsx';
import { type ImageCarouselProps } from './types.ts';

const displayName = 'common.Extensions.ImageCarousel';

const ImageCarousel: FC<ImageCarouselProps> = ({
  slideUrls = images,
  options = { loop: true, align: 'start' },
  isAutoplay = false,
  isImageFullWidth,
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
                className={clsx('min-w-full', {
                  'sm:mr-4': !isImageFullWidth,
                  'sm:w-[31.875rem]': !isImageFullWidth,
                  'sm:min-w-[31.875rem]': !isImageFullWidth,
                })}
                key={url}
              >
                <img
                  alt="file"
                  src={url}
                  className={clsx('w-full object-cover', {
                    'aspect-[380/248]': !isImageFullWidth,
                    'sm:aspect-[510/248]': !isImageFullWidth,
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 m-0 flex w-full justify-center">
        {scrollSnaps.map((_, index) => (
          <DotButton
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={() => scrollTo(index)}
            className={clsx('group', {
              'py-[10px]': !isChangeSlideDotButton,
              'my-[-10px]': !isChangeSlideDotButton,
            })}
          >
            <div
              className={clsx(
                'mx-1 h-2 w-2 cursor-pointer rounded-full bg-gray-200 transition-all duration-normal group-hover:bg-blue-400',
                {
                  'bg-gray-500': index === selectedIndex,
                  'w-[5.875rem]': !isChangeSlideDotButton,
                  'h-[.1875rem]': !isChangeSlideDotButton,
                  'mx-[.3125rem]': !isChangeSlideDotButton,
                },
              )}
            />
          </DotButton>
        ))}
      </div>
    </div>
  );
};

ImageCarousel.displayName = displayName;

export default ImageCarousel;
