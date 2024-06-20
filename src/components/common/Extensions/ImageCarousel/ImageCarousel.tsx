import clsx from 'clsx';
import React, { type FC } from 'react';

import { images } from './consts.ts';
import { useEmblaCarouselSettings } from './hooks.ts';
import DotButton from './partials/DotButton.tsx';
import { type ImageCarouselProps } from './types.ts';

const displayName = 'common.Extensions.ImageCarousel';

const ImageCarousel: FC<ImageCarouselProps> = ({
  slideUrls = images,
  options = { loop: true, align: 'start' },
  className,
}) => {
  const { scrollSnaps, emblaRef, scrollTo, selectedIndex } =
    useEmblaCarouselSettings(options);

  return (
    <div className={clsx(className, 'relative pb-[1.75rem]')}>
      <div className="cursor-grab overflow-hidden">
        <div ref={emblaRef}>
          <div className="flex">
            {slideUrls.map((url) => (
              <div
                className="min-w-full sm:mr-4 sm:w-[31.875rem] sm:min-w-[31.875rem]"
                key={url}
              >
                <img
                  alt="file"
                  src={url}
                  className="aspect-[380/248] w-full object-cover sm:aspect-[510/248]"
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
            className={clsx(
              'mx-1 h-2 w-2 cursor-pointer rounded-full bg-gray-200 transition-all duration-normal hover:bg-blue-400',
              {
                'bg-gray-500': index === selectedIndex,
              },
            )}
          />
        ))}
      </div>
    </div>
  );
};

ImageCarousel.displayName = displayName;

export default ImageCarousel;
