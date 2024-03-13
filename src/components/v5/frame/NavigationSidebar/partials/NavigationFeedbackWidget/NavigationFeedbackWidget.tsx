import React from 'react';
import { FormattedMessage } from 'react-intl';

import { openFeaturesBugs } from '~hooks/useBeamer.ts';

const displayName =
  'v5.frame.NavigationSidebar.NavigationSidebarSecondLevel.NavigationSidebarButton';

const MSG = {
  widgetTitle: {
    id: `${displayName}.widgetTitle`,
    defaultMessage: 'Beta feedback',
  },
  widgetDescription: {
    id: `${displayName}.widgetDescription`,
    defaultMessage:
      "We'd love to hear your thoughts on our private beta including features and bug report.",
  },
  widgetButtonText: {
    id: `${displayName}.widgetButtonText`,
    defaultMessage: 'Give us feedback',
  },
};

const NavigationFeedbackWidget = () => (
  <div className="rounded-lg bg-base-bg px-2.5 py-3 text-gray-900">
    <h4 className="mb-2 text-2">
      <FormattedMessage {...MSG.widgetTitle} />
    </h4>
    <p className="-mb-1 text-xs font-normal">
      <FormattedMessage {...MSG.widgetDescription} />
    </p>
    <button
      type="button"
      className="text-xs font-medium underline hover:text-blue-400"
      onClick={openFeaturesBugs}
    >
      <FormattedMessage {...MSG.widgetButtonText} />
    </button>
  </div>
);

NavigationFeedbackWidget.displayName = displayName;

export default NavigationFeedbackWidget;
