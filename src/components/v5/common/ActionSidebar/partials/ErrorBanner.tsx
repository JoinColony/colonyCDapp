import React, { FC } from 'react';

import NotificationBanner from '~common/Extensions/NotificationBanner';
import { ErrorBannerProps } from '../types';

const displayName = 'v5.common.ActionSidebar.partials.ErrorBanner';

const ErrorBanner: FC<ErrorBannerProps> = ({ title }) => (
  <div className="mb-7">
    <NotificationBanner status="warning" title={title} />
  </div>
);

ErrorBanner.displayName = displayName;

export default ErrorBanner;
