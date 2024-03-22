import { useEffect, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';

const useCurrentBlockTime = () => {
  const { wallet } = useAppContext();

  const [currentBlockTime, setCurrentBlockTime] = useState<number | null>(null);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    const fetchCurrentBlockTime = async () => {
      const { ethersProvider } = wallet;

      const block = await ethersProvider?.getBlock('latest');
      if (!block) {
        return;
      }

      setCurrentBlockTime(block.timestamp);
    };

    fetchCurrentBlockTime();
  }, [wallet]);

  return currentBlockTime;
};

export default useCurrentBlockTime;
