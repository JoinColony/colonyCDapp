import { type EmblaOptionsType } from 'embla-carousel-react';

export interface ImageCarouselProps {
  slideUrls?: string[];
  options?: EmblaOptionsType;
  className?: string;
  isImageFullWidth?: boolean;
  isAutoplay?: boolean;
  isChangeSlideDotButton?: boolean;
  setSelectedIndex?: (index: number) => void;
}

export type DotButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
