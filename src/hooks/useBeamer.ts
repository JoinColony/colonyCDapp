import { useEffect } from 'react';

import { FEATURES_BUGS, WHATS_NEW } from '~constants/index.ts';
import { uiEvents, UIEvent } from '~uiEvents/index.ts';

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

export const openWhatsNew = (e): void => {
  if (typeof window.Beamer !== 'undefined') {
    e.preventDefault();
    window.Beamer.show();
  } else {
    window.open(WHATS_NEW, '_blank');
  }
};

export const openFeaturesBugs = (e): void => {
  uiEvents.emit(UIEvent.giveFeedback);
  if (typeof window.Beamer !== 'undefined') {
    e.preventDefault();
    window.Beamer.showIdeas(true);
  } else {
    window.open(FEATURES_BUGS, '_blank');
  }
};
