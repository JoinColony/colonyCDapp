import React, { useEffect, useState } from 'react';
import { type MessageDescriptor, defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import PageLoader from '~v5/common/PageLoader/index.ts';

import { DELAYED_LOADING_DURATION, FAILED_LOADING_DURATION } from './consts.ts';

import styles from './LoadingTemplate.module.css';

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
    }, DELAYED_LOADING_DURATION);
    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    const failedTimer = setTimeout(() => {
      setLoadingState(LoadingState.FAILED);
    }, FAILED_LOADING_DURATION);
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
