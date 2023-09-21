import { useEffect, useState } from 'react';
import { PREV_COLONY_LOCAL_STORAGE_KEY } from './ColonyContext';
import { useAppContext } from '~hooks';

export const METACOLONY_COLONY_NAME = 'meta';

// Retrieve the previous colony name from local storage, if it exists.
// This is so that routes that don't have a colony in the url can still use a colony.
// It will just be the last colony that was visited.

// "hideLoader" is an implementation detail to hide the loader when the colony name changes as a result of it being
// fetched from local storage.

export const usePreviousColonyName = ({
  colonyName,
}: {
  colonyName: string;
}) => {
  const { user } = useAppContext();
  const { walletAddress } = user ?? {};

  const [prevColonyName, setPrevColonyName] = useState<string>(
    METACOLONY_COLONY_NAME,
  );
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      const previousColonyName = localStorage.getItem(
        `${PREV_COLONY_LOCAL_STORAGE_KEY}:${walletAddress}`,
      );

      if (previousColonyName) {
        setPrevColonyName(previousColonyName);
        setHideLoader(true);
      }
    }
  }, [walletAddress, setPrevColonyName]);

  useEffect(() => {
    if (colonyName && colonyName !== prevColonyName) {
      setPrevColonyName(colonyName);

      // persist
      if (walletAddress) {
        localStorage.setItem(
          `${PREV_COLONY_LOCAL_STORAGE_KEY}:${walletAddress}`,
          colonyName,
        );
      }
    }
  }, [colonyName, prevColonyName, walletAddress]);

  useEffect(() => {
    setHideLoader(false);
  }, [colonyName]);

  return { hideLoader, prevColonyName, setPrevColonyName };
};
