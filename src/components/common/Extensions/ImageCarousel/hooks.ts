import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

export const useEmblaCarouselSettings = (options, autoplay) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    options,
    autoplay
      ? [
          Autoplay({
            playOnInit: true,
            delay: 3000,
          }),
        ]
      : [],
  );
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

  return {
    scrollSnaps,
    emblaRef,
    scrollTo,
    selectedIndex,
  };
};
