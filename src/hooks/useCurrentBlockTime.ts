import { useCallback, useEffect, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';

const useCurrentBlockTime = () => {
  const { wallet } = useAppContext();

  const [currentBlockTime, setCurrentBlockTime] = useState<number | null>(null);

  const fetchCurrentBlockTime = useCallback(async () => {
    if (!wallet) {
      return;
    }

    const { ethersProvider } = wallet;

    const block = await ethersProvider?.getBlock('latest');
    if (!block) {
      return;
    }

    setCurrentBlockTime(block.timestamp);
  }, [wallet]);

  useEffect(() => {
    fetchCurrentBlockTime();
  }, [fetchCurrentBlockTime]);

  return { currentBlockTime, fetchCurrentBlockTime };
};

export default useCurrentBlockTime;
