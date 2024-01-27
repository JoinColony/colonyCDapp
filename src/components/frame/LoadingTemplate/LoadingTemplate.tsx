import React, { useEffect, useState } from 'react';
import { MessageDescriptor, defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import PageLoader from '~v5/common/PageLoader/index.ts';

import styles from './LoadingTemplate.css';

const displayName = 'frame.LoadingTemplate';

interface Props {
  loadingText?: string | MessageDescriptor;
}

const MSG = defineMessages({
  loadingDelayed: {
    id: `${displayName}.loadingDelayed`,
    defaultMessage: `It’s taking a while to connect. `,
  },

  loadingDelayedDescription: {
    id: `${displayName}.loadingDelayedDescription`,
    defaultMessage: 'Please hold tight while we keep trying.',
  },

  loadingFailed: {
    id: `${displayName}.loadingFailed`,
    defaultMessage: `Oh no! We tried but couldn’t get any response from the service.`,
  },

  loadingFailedDescription: {
    id: 'pages.LoadingTemplate.loadingFailedDescription',
    defaultMessage: 'Please try again later.',
  },
});

const delayedLoadingDuration = 15 * 1000; // 15 seconds
export const failedLoadingDuration = 30 * 1000; // 30 seconds

enum LoadingState {
  DEFAULT = 'default',
  DELAYED = 'delayed',
  FAILED = 'failed',
}

const LoadingTemplate = ({ loadingText }: Props) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.DEFAULT,
  );

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setLoadingState(LoadingState.DELAYED);
    }, delayedLoadingDuration);
    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    const failedTimer = setTimeout(() => {
      setLoadingState(LoadingState.FAILED);
    }, failedLoadingDuration);
    return () => clearTimeout(failedTimer);
  }, []);

  const getLoadingDescription = () => {
    if (loadingState === LoadingState.DELAYED) {
      return (
        <>
          {formatText(MSG.loadingDelayed)}
          <br />
          {formatText(MSG.loadingDelayedDescription)}
        </>
      );
    }
    if (loadingState === LoadingState.FAILED) {
      return (
        <>
          {formatText(MSG.loadingFailed)}
          <br />
          {formatText(MSG.loadingFailedDescription)}
        </>
      );
    }

    return undefined;
  };

  return (
    <div className={styles.main}>
      <main className={styles.mainContent}>
        <PageLoader
          loadingText={loadingText ? formatText(loadingText) : undefined}
          loadingDescription={getLoadingDescription()}
        />
      </main>
    </div>
  );
};

export default LoadingTemplate;
