import React, { FC } from 'react';
import clsx from 'clsx';

import { ImageCarouselProps } from './types';
import { images } from './consts';
import DotButton from './partials/DotButton';
import styles from './ImageCarousel.module.css';
import { useEmblaCarouselSettings } from './hooks';

const displayName = 'common.Extensions.ImageCarousel';

const ImageCarousel: FC<ImageCarouselProps> = ({
  slideUrls = images,
  options = { loop: true, align: 'start' },
}) => {
  const { scrollSnaps, emblaRef, scrollTo, selectedIndex } =
    useEmblaCarouselSettings(options);

  return (
    <div className={styles.container}>
      <div className={styles.embla}>
        <div ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {slideUrls.map((url) => (
              <div className={styles.emblaSlide} key={url}>
                <img alt="file" src={url} className={styles.image} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.dots}>
        {scrollSnaps.map((_, index) => (
          <DotButton
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={() => scrollTo(index)}
            className={clsx(styles.dot, {
              [styles.dotSelected]: index === selectedIndex,
            })}
          />
        ))}
      </div>
    </div>
  );
};

ImageCarousel.displayName = displayName;

export default ImageCarousel;
