import { useCallback } from 'react';

import {
  COLONY_BUG_REPORT,
  COLONY_CHANGELOG,
  COLONY_FEATURE_REQUEST,
} from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useFeaturebaseContext } from '~context/FeaturebaseContext/FeaturebaseContext.ts';

export enum FeaturebaseBoards {
  FeatureRequest = '💡 Feature Request',
  BugReport = 'Bug Report',
}

export const useOpenChangelogWidget = () => {
  const { isFeaturebaseBooted } = useFeaturebaseContext();

  return useCallback(() => {
    if (isFeaturebaseBooted) {
      window.Featurebase('manually_open_changelog_popup');
    } else {
      window.open(COLONY_CHANGELOG, '_blank');
    }
  }, [isFeaturebaseBooted]);
};

export const useOpenFeedbackWidget = (targetBoard?: string) => {
  const { isFeaturebaseBooted } = useFeaturebaseContext();

  let colonyName: string | undefined;
  let colonyAddress: string | undefined;
  let colonyVersion: string | undefined;

  try {
    // useColonyContext can only be used within the colonyContextProvider
    const colonyContext = useColonyContext();

    if (colonyContext) {
      colonyName = colonyContext.colony.name;
      colonyAddress = colonyContext.colony.colonyAddress;
      colonyVersion = String(colonyContext.colony.version);
    }
  } catch {
    // silence
  }

  const { user } = useAppContext();

  const userEmail = user?.profile?.email;
  const userDisplayName = user?.profile?.displayName;
  const userWalletAddress = user?.walletAddress;

  return useCallback(() => {
    if (isFeaturebaseBooted) {
      window.postMessage({
        target: 'FeaturebaseWidget',
        data: {
          action: 'updateMetadata',
          metadata: {
            colonyVersion,
            colonyName,
            colonyAddress,
            userEmail,
            userDisplayName,
            userWalletAddress,
          },
        },
      });

      window.postMessage({
        target: 'FeaturebaseWidget',
        data: {
          action: 'openFeedbackWidget',
          setBoard: targetBoard,
        },
      });
    } else {
      if (targetBoard === FeaturebaseBoards.FeatureRequest) {
        window.open(COLONY_FEATURE_REQUEST, '_blank');
      }

      if (targetBoard === FeaturebaseBoards.BugReport) {
        window.open(COLONY_BUG_REPORT, '_blank');
      }
    }
  }, [
    colonyAddress,
    colonyName,
    colonyVersion,
    isFeaturebaseBooted,
    userDisplayName,
    userEmail,
    userWalletAddress,
    targetBoard,
  ]);
};
