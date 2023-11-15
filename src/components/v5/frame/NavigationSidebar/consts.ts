export const secondLevelWrapperAnimation = {
  hidden: {
    width: 0,
    transition: {
      delay: 0.1,
      staggerDirection: -1,
    },
  },
  visible: {
    width: '19.8125rem',
    transition: {
      delayChildren: 0.1,
    },
  },
};

export const thirdLevelWrapperAnimation = {
  hidden: {
    width: 0,
    transition: {
      delay: 0.1,
      staggerDirection: -1,
    },
  },
  visible: {
    width: 'auto',
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

export const secondLevelContentAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const thirdLevelContentAnimation = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};
