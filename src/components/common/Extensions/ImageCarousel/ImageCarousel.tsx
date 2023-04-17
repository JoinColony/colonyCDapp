import React, { FC } from 'react';
// import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import styles from './ImageCarousel.module.css';

const displayName = 'common.Extensions.ImageCarousel';

const images = [
  'https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345767/demo_image2.jpg',
  'https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345874/demo_image1.jpg',
  'https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345767/demo_image2.jpg',
];

const ImageCarousel: FC = () => {
  return (
    <div className={styles.carouselWrapper}>
      <Carousel
        className="cursor-pointer w-[500px] h-[400px] relative"
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        swipeable
        useKeyboardArrows
        emulateTouch
        centerSlidePercentage={80}
        // renderIndicator={(clickHandler, isSelected, index) => {
        //   return (
        //     <li
        //       onClick={clickHandler}
        //       className={`w-3 h-3 rounded ${isSelected ? 'bg-blue-400' : 'bg-gray-500'}`}
        //       key={index}
        //       role="button"
        //       aria-label={`slide item ${index}`}
        //       tabIndex="0"
        //     />
        //   );
        // }}
      >
        {images.map((url) => (
          <div className="slide">
            <img alt="file" src={url} key={url} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

ImageCarousel.displayName = displayName;

export default ImageCarousel;
