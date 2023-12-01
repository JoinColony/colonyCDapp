import React, { ReactNode } from 'react';

import styles from './PageLoader.css';

interface PageLoaderProps {
  loadingText: ReactNode;
  loadingDescription: ReactNode;
}

const PageLoader = ({ loadingDescription, loadingText }: PageLoaderProps) => {
  return (
    <div className={styles.pageLoader}>
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="var(--color-gray-100)"
          strokeWidth={4}
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="var(--color-gray-900)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="120 200"
        />
      </svg>
      {loadingText && <div>{loadingText}</div>}
      {loadingDescription && <div>{loadingDescription}</div>}
    </div>
  );
};

export default PageLoader;
