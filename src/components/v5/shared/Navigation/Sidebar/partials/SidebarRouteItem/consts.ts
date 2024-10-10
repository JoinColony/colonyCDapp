import { type Variants } from 'framer-motion';

export const motionVariants: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
  },
  expanded: {
    opacity: 1,
    height: 'auto',
  },
};
