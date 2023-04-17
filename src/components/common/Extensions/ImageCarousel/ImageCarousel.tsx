import React, { FC } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { images } from './const';
import styles from './ImageCarousel.module.css';
import { ImageCarouselProps } from './ImageCarousel.types';
import './ImageCarousel.css'; // to fix rendering styles in storybook
import useWindowSize from '~hooks/useWindowSize';
import { images } from './consts';

const displayName = 'common.Extensions.ImageCarousel';

const ImageCarousel: FC<ImageCarouselProps> = ({ transitionTime = 300, slideUrls = images }) => {
  const windowSize = useWindowSize();
  const width = windowSize?.width ?? 0;
  const setSlidePercentage = (width >= 1024 && 90) || (width >= 850 && 65) || (width >= 427 && 100);

  return (
    <div className={styles.carouselWrapper}>
      <Carousel
        className="max-w-[23.75rem] sm:max-w-[49.0625rem] md:max-w-[35.75rem]"
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        swipeable
        useKeyboardArrows
        emulateTouch
        centerSlidePercentage={setSlidePercentage || 100}
        centerMode
        transitionTime={transitionTime}
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <li>
            <div
              className={`opacity-100 w-2 h-2 cursor-pointer rounded-full mx-2 transition-all hover:bg-blue-400 ${
                isSelected ? 'bg-gray-500' : 'bg-gray-200'
              }`}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              onKeyPress={onClickHandler}
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`${label} ${index + 1}`}
            />
          </li>
        )}
      >
        {slideUrls.map((url) => (
          <div className="slide" key={url}>
            <img alt="file" src={url} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

ImageCarousel.displayName = displayName;

export default ImageCarousel;
