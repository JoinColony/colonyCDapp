import { type Variants } from 'framer-motion';

export const colonySidebarAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};
