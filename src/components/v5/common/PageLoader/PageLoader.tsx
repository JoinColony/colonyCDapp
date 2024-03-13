import clsx from 'clsx';
import React, { type ReactNode } from 'react';

import ColonyIcon from '~icons/ColonyIcon.tsx';

import styles from './PageLoader.module.css';

const STROKE_WIDTH = 4;
const RADIUS = 60 - STROKE_WIDTH / 2; // stroke goes on both sides so we need to reduce the radius just by half

interface PageLoaderProps {
  loadingText?: ReactNode;
  loadingDescription?: ReactNode;
}

const PageLoader = ({ loadingDescription, loadingText }: PageLoaderProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[7.5rem] w-[7.5rem]">
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
        <ColonyIcon
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          size={48}
        />
      </div>
      {loadingText && (
        <div className="mt-6 text-sm font-medium uppercase tracking-[0.075rem] text-gray-900">
          {loadingText}
        </div>
      )}
      {loadingDescription && (
        <div className="mt-6 text-sm font-medium text-gray-900">
          {loadingDescription}
        </div>
      )}
    </div>
  );
};

export default PageLoader;
