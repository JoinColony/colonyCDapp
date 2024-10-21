import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel.tsx';
import Slide1 from '~images/assets/landing/slider1.png';
import Slide2 from '~images/assets/landing/slider2.png';
import Slide3 from '~images/assets/landing/slider3.png';
import SlideMobile from '~images/assets/landing/sliderMobile.png';

const displayName = 'frame.LandingPageCarousel';

const titleMSG = defineMessages({
  titleSlide0: {
    id: `${displayName}.titleSlide0`,
    defaultMessage: 'A powerful, all-in-one payments suite',
  },
  titleSlide1: {
    id: `${displayName}.titleSlide1`,
    defaultMessage: 'Make bulk payments your way with ease',
  },
  titleSlide2: {
    id: `${displayName}.titleSlide2`,
    defaultMessage: 'Easily track & manage shared finances',
  },
});

const descriptionMSG = defineMessages({
  descriptionSlide0: {
    id: `${displayName}.dascriptionSlide0`,
    defaultMessage:
      'From simple transactions to complex financial operations like Streaming, Milestone based, and Split payments, you can do it with Colony.',
  },
  descriptionSlide1: {
    id: `${displayName}.dascriptionSlide0`,
    defaultMessage:
      'Make bulk payments to different recipients using various tokens, amounts and scheduling. Saving time and reducing potential errors.',
  },
  descriptionSlide2: {
    id: `${displayName}.dascriptionSlide0`,
    defaultMessage:
      'Transparency and clarity around shared finances is made simply with dashboard highlights, transaction history, and shared decision making. ',
  },
});

const LandingPageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div>
      <div className="w-full max-w-[31.25rem] md:hidden">
        <img className="h-auto w-full" src={SlideMobile} alt="slider mobile" />
      </div>
      <div className="hidden w-full max-w-[31.25rem] overflow-hidden md:block">
        <div>
          <div className="relative h-[4.75rem]">
            {Object.keys(titleMSG).map((_, index) => (
              <h1
                className={clsx(
                  'absolute left-0 top-0 transition-opacity duration-normal heading-2',
                  {
                    'opacity-100': currentSlide === index,
                    'opacity-0': currentSlide !== index,
                    'delay-150': currentSlide === index,
                  },
                )}
              >
                <FormattedMessage {...titleMSG[`titleSlide${index}`]} />
              </h1>
            ))}
          </div>
          <div className="relative mb-9 mt-[.875rem] h-[2.5rem]">
            {Object.keys(descriptionMSG).map((_, index) => (
              <p
                className={clsx(
                  'absolute left-0 top-0 text-md font-normal transition-opacity duration-normal',
                  {
                    'opacity-100': currentSlide === index,
                    'opacity-0': currentSlide !== index,
                    'delay-150': currentSlide === index,
                  },
                )}
              >
                <FormattedMessage
                  {...descriptionMSG[`descriptionSlide${index}`]}
                />
              </p>
            ))}
          </div>
        </div>
        <ImageCarousel
          slideUrls={[Slide1, Slide2, Slide3]}
          options={{ align: 'center', loop: true }}
          isImageFullWidth
          isAutoplay
          isChangeSlideDotButton={false}
          setSelectedIndex={(currentSlideIndex) =>
            setCurrentSlide(currentSlideIndex)
          }
          className="mx-[-30px] pb-[115px]"
        />
      </div>
    </div>
  );
};

LandingPageCarousel.displayName = displayName;

export default LandingPageCarousel;
