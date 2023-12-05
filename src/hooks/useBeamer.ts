import { useEffect } from 'react';

export const useBeamer = (): void => {
  useEffect(() => {
    const initializeBeamer = () => {
      if (typeof window.Beamer !== 'undefined') {
        window.Beamer.init();
      }
    };

    initializeBeamer();
  }, []);
};

export const openWhatsNew = (): void => {
  if (typeof window.Beamer !== 'undefined') {
    window.Beamer.show();
  }
};

export const openFeaturesBugs = (): void => {
  if (typeof window.Beamer !== 'undefined') {
    window.Beamer.showIdeas(true);
  }
};
