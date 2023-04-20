import React, { FC } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { images } from './const';
import styles from './ImageCarousel.module.css';
import { ImageCarouselProps } from './ImageCarousel.types';

const displayName = 'common.Extensions.ImageCarousel';

const ImageCarousel: FC<ImageCarouselProps> = ({ slidePercentage = 95, transitionTime = 300, slideUrls = images }) => {
  return (
    <div className={styles.carouselWrapper}>
      <Carousel
        className="w-[33.5rem]"
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        swipeable
        useKeyboardArrows
        emulateTouch
        centerSlidePercentage={slidePercentage}
        centerMode
        transitionTime={transitionTime}
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <li>
            <div
              className={`opacity-100 w-2 h-2 cursor-pointer rounded-full mx-2 hover:bg-blue-400 ${
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
