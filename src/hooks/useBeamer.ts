import { useEffect } from 'react';

declare const Beamer: any;

export const useBeamer = (): void => {
  useEffect(() => {
    const initializeBeamer = () => {
      if (typeof Beamer !== 'undefined') {
        Beamer.init();
      }
    };

    initializeBeamer();
  }, []);
};

export const useWhatsNew = (
  event: React.MouseEvent<HTMLAnchorElement>,
): void => {
  if (typeof Beamer !== 'undefined') {
    event.preventDefault();
    Beamer.show();
  }
};

export const useFeaturesBugs = (
  event: React.MouseEvent<HTMLAnchorElement>,
): void => {
  if (typeof Beamer !== 'undefined') {
    event.preventDefault();
    Beamer.showIdeas(true);
  }
};
