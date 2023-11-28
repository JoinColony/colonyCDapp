import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '~shared/Icon';

const MSG = {
  label: {
    id: 'FeedbackWidget.label',
    defaultMessage: 'Beta feedback',
  },
};

const FeedbackWidget = () => (
  <button
    type="button"
    className="md:transition-all mt-auto flex items-center bg-blue-100 rounded-lg py-2 px-2.5 text-blue-400 group/feedback-button"
  >
    <Icon name="chats-circle" appearance={{ size: 'mediumSmall' }} />
    <span
      className={`
        heading-5
        md:text-2
        md:max-w-0
        md:overflow-hidden
        md:group-hover/feedback-button:max-w-xs
        md:transition-[max-width]
      `}
    >
      <span className="align-middle md:pl-2 md:whitespace-nowrap">
        <FormattedMessage {...MSG.label} />
      </span>
    </span>
  </button>
);

export default FeedbackWidget;
