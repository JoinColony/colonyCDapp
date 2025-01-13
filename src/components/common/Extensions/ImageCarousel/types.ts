import { type EmblaOptionsType } from 'embla-carousel-react';

export interface ImageCarouselProps {
  slideUrls?: string[];
  slidesContainerClassName?: string;
  slideWrapperClassName?: string;
  slideImageClassName?: string;
  options?: EmblaOptionsType;
  className?: string;
  isAutoplay?: boolean;
  isChangeSlideDotButton?: boolean;
  setSelectedIndex?: (index: number) => void;
  sliderHeader?: React.ReactNode;
}

export type DotButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
