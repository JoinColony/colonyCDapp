import { ChatCircle } from '@phosphor-icons/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  onClick: () => void;
}

const MSG = {
  label: {
    id: 'FeedbackWidget.label',
    defaultMessage: 'Beta feedback',
  },
};

const FeedbackButton = ({ onClick }: Props) => (
  <button
    type="button"
    className="group/feedback-button mt-auto flex items-center rounded-lg px-2.5 py-2 text-gray-900 sm:transition-all sm:hover:bg-gray-900 sm:hover:text-base-white"
    onClick={onClick}
  >
    <ChatCircle size={22} />
    <span
      className={`
        heading-5
        sm:max-w-0
        sm:overflow-hidden
        sm:transition-[max-width]
        sm:text-2
        sm:group-hover/feedback-button:max-w-xs
      `}
    >
      <span className="align-middle sm:whitespace-nowrap sm:pl-2">
        <FormattedMessage {...MSG.label} />
      </span>
    </span>
  </button>
);

export default FeedbackButton;
