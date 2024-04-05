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
    className="group/feedback-button mt-auto flex items-center rounded-lg px-2.5 py-2 text-gray-900 md:transition-all md:hover:bg-gray-900 md:hover:text-base-white"
    onClick={onClick}
  >
    <ChatCircle size={22} />
    <span
      className={`
        heading-5
        md:max-w-0
        md:overflow-hidden
        md:transition-[max-width]
        md:text-2
        md:group-hover/feedback-button:max-w-xs
      `}
    >
      <span className="align-middle md:whitespace-nowrap md:pl-2">
        <FormattedMessage {...MSG.label} />
      </span>
    </span>
  </button>
);

export default FeedbackButton;
