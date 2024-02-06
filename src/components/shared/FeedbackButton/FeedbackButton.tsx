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
    className="md:transition-all mt-auto flex items-center text-gray-900 md:hover:bg-gray-900 md:hover:text-base-white rounded-lg py-2 px-2.5 group/feedback-button z-10"
    onClick={onClick}
  >
    <ChatCircle size={22} />
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

export default FeedbackButton;
