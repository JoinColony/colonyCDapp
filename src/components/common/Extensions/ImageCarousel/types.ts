import { type EmblaOptionsType } from 'embla-carousel-react';

export interface ImageCarouselProps {
  slideUrls?: string[];
  slideWrapperClassName?: string;
  slideImageClassName?: string;
  options?: EmblaOptionsType;
  className?: string;
  isAutoplay?: boolean;
  isChangeSlideDotButton?: boolean;
  setSelectedIndex?: (index: number) => void;
}

export type DotButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
