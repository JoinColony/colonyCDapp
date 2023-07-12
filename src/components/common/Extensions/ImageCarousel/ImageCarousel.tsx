import React, { FC, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';

import { ImageCarouselProps } from './types';
import { images } from './consts';
import DotButton from './partials/DotButton';
import styles from './ImageCarousel.module.css';

const displayName = 'common.Extensions.ImageCarousel';

const ImageCarousel: FC<ImageCarouselProps> = ({
  slideUrls = images,
  options = { loop: true, align: 'start' },
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onInit = useCallback((embla: EmblaCarouselType) => {
    setScrollSnaps(embla.scrollSnapList());
  }, []);

  const onSelect = useCallback((embla: EmblaCarouselType) => {
    setSelectedIndex(embla.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

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
            className={`${styles.dot}`.concat(
              index === selectedIndex ? ` ${styles.dotSelected}` : '',
            )}
          />
        ))}
      </div>
    </div>
  );
};

ImageCarousel.displayName = displayName;

export default ImageCarousel;
