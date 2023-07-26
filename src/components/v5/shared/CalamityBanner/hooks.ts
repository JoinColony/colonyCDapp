import { useCallback, useEffect, useState } from 'react';
import { CalamityBannerItemProps } from './types';

export const CALAMITY_BANNER = 'calamity-banner';

export const useCalamityBanner = (items: CalamityBannerItemProps[]) => {
  const [showBanner, setShowBanner] = useState(true);
  const [activeElement, setActiveElement] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem(CALAMITY_BANNER);
    if (data !== null) setShowBanner(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(CALAMITY_BANNER, JSON.stringify(showBanner));
  }, [showBanner]);

  const handleBannerChange = useCallback(() => {
    setActiveElement(
      activeElement === items.length - 1 ? 0 : activeElement + 1,
    );
  }, [activeElement, items.length]);

  useEffect(() => {
    items.forEach(({ mode }, index) => {
      if (mode === 'error') {
        setActiveElement(index);
      }
    });
  }, [items]);

  return {
    showBanner,
    setShowBanner,
    handleBannerChange,
    activeElement,
  };
};
