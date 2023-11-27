import { EmblaOptionsType } from 'embla-carousel-react';

export interface ImageCarouselProps {
  slideUrls?: string[];
  options?: EmblaOptionsType;
}

export type DotButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
