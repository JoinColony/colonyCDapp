import clsx from 'clsx';
import React, { type ReactNode } from 'react';

import Icon from '~shared/Icon/index.ts';

import styles from './PageLoader.css';

const STROKE_WIDTH = 4;
const RADIUS = 60 - STROKE_WIDTH / 2; // stroke goes on both sides so we need to reduce the radius just by half

interface PageLoaderProps {
  loadingText?: ReactNode;
  loadingDescription?: ReactNode;
}

const PageLoader = ({ loadingDescription, loadingText }: PageLoaderProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[7.5rem] h-[7.5rem]">
        <svg
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
          className={clsx('block', styles.pageLoaderCircle)}
        >
          <circle
            cx="60"
            cy="60"
            fill="none"
            stroke="var(--color-gray-100)"
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            cx="60"
            cy="60"
            fill="none"
            stroke="var(--color-gray-900)"
            strokeLinecap="round"
            strokeDasharray="120 200"
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />
        </svg>
        <Icon
          className="!h-12 !w-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          name="colony-icon"
        />
      </div>
      {loadingText && (
        <div className="text-gray-900 text-sm font-medium mt-6 uppercase tracking-[0.075rem]">
          {loadingText}
        </div>
      )}
      {loadingDescription && (
        <div className="text-gray-900 text-sm font-medium mt-6">
          {loadingDescription}
        </div>
      )}
    </div>
  );
};

export default PageLoader;
