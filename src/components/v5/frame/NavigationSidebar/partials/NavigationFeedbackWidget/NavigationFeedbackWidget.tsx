import React from 'react';
import { FormattedMessage } from 'react-intl';

import { openFeaturesBugs } from '~hooks/useBeamer';

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
  <div className="rounded-lg px-2.5 py-3 bg-blue-100 text-blue-400">
    <h4 className="text-2 mb-2">
      <FormattedMessage {...MSG.widgetTitle} />
    </h4>
    <p className="text-xs font-normal -mb-1">
      <FormattedMessage {...MSG.widgetDescription} />
    </p>
    <button
      type="button"
      className="text-xs font-medium underline hover:text-gray-900"
      onClick={openFeaturesBugs}
    >
      <FormattedMessage {...MSG.widgetButtonText} />
    </button>
  </div>
);

NavigationFeedbackWidget.displayName = displayName;

export default NavigationFeedbackWidget;
