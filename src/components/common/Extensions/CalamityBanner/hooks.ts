import { useEffect, useState } from 'react';

export const CALAMITY_BANNER = 'calamity-banner';

export const useCalamityBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem(CALAMITY_BANNER);
    if (data !== null) setShowBanner(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(CALAMITY_BANNER, JSON.stringify(showBanner));
  }, [showBanner]);

  return {
    showBanner,
    setShowBanner,
  };
};
