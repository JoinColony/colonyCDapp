import { type EmblaOptionsType } from 'embla-carousel-react';

export interface ImageCarouselProps {
  slideUrls?: string[];
  options?: EmblaOptionsType;
  className?: string;
}

export type DotButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
