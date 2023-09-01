import { useEffect, useState } from 'react';
import { PREV_COLONY_LOCAL_STORAGE_KEY } from './ColonyContext';
import { SetStateFn } from '~types';

// Retrieve the previous colony name from local storage, if it exists.
// This is so that routes that don't have a colony in the url can still use a colony.
// It will just be the last colony that was visited.

// "hideLoader" is an implementation detail to hide the loader when the colony name changes as a result of it being
// fetched from local storage.

export const usePreviousColonyName = ({
  walletAddress,
  colonyName,
  setPrevColonyName,
}: {
  colonyName: string;
  setPrevColonyName: SetStateFn<string>;
  walletAddress?: string;
}) => {
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      const prevColony = localStorage.getItem(
        `${PREV_COLONY_LOCAL_STORAGE_KEY}:${walletAddress}`,
      );

      if (prevColony) {
        setPrevColonyName(prevColony);
        setHideLoader(true);
      }
    }
  }, [walletAddress, setPrevColonyName]);

  useEffect(() => {
    setHideLoader(false);
  }, [colonyName]);

  return { hideLoader };
};
