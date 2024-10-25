import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel.tsx';
import Slide1 from '~images/assets/landing/slider1.png';
import Slide2 from '~images/assets/landing/slider2.png';
import Slide3 from '~images/assets/landing/slider3.png';
import SlideMobile from '~images/assets/landing/sliderMobile.png';

const displayName = 'frame.LandingPageCarousel';

const MSG = defineMessages({
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
  descriptionSlide0: {
    id: `${displayName}.descriptionSlide0`,
    defaultMessage:
      'From simple transactions to complex financial operations like Streaming, Milestone based, and Split payments, you can do it with Colony.',
  },
  descriptionSlide1: {
    id: `${displayName}.descriptionSlide1`,
    defaultMessage:
      'Make bulk payments to different recipients using various tokens, amounts and scheduling. Saving time and reducing potential errors.',
  },
  descriptionSlide2: {
    id: `${displayName}.descriptionSlide2`,
    defaultMessage:
      'Transparency and clarity around shared finances is made simply with dashboard highlights, transaction history, and shared decision making. ',
  },
});

const slides = [
  {
    title: MSG.titleSlide0,
    description: MSG.descriptionSlide0,
  },
  {
    title: MSG.titleSlide1,
    description: MSG.descriptionSlide1,
  },
  {
    title: MSG.titleSlide2,
    description: MSG.descriptionSlide2,
  },
];

const LandingPageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div>
      <div className="w-full max-w-[31.25rem] md:hidden">
        <img className="h-auto w-full" src={SlideMobile} alt="slider mobile" />
      </div>
      <div className="hidden w-full max-w-[31.25rem] md:block">
        <div className="relative mb-9 h-[7.25rem]">
          {slides.map((slide, index) => {
            const isCurrentSlide = currentSlide === index;
            return (
              <div className="absolute left-0 top-0">
                <h1
                  className={clsx(
                    'transition-opacity duration-normal heading-2',
                    {
                      'opacity-100 delay-150': isCurrentSlide,
                      'opacity-0': !isCurrentSlide,
                    },
                  )}
                >
                  <FormattedMessage {...slide.title} />
                </h1>
                <p
                  className={clsx(
                    'mt-[.875rem] text-md font-normal transition-opacity duration-normal',
                    {
                      'opacity-100 delay-150': isCurrentSlide,
                      'opacity-0': !isCurrentSlide,
                    },
                  )}
                >
                  <FormattedMessage {...slide.description} />
                </p>
              </div>
            );
          })}
        </div>
        <ImageCarousel
          slideUrls={[Slide1, Slide2, Slide3]}
          slideWrapperClassName="min-w-full"
          slideImageClassName="w-full object-cover"
          options={{ align: 'center', loop: true }}
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
