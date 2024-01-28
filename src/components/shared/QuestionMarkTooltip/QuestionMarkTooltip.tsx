import React from 'react';
import { type MessageDescriptor, FormattedMessage } from 'react-intl';
import { type PopperOptions } from 'react-popper-tooltip';

import Icon from '~shared/Icon/index.ts';
import { Tooltip } from '~shared/Popover/index.ts';
import { type UniversalMessageValues } from '~types/index.ts';

const displayName = 'QuestionMarkTooltip';

interface Props {
  tooltipText: string | MessageDescriptor;
  tooltipTextValues?: UniversalMessageValues;
  /** Options to pass to the underlying PopperJS element. See here for more: https://popper.js.org/docs/v2/constructors/#options. */
  tooltipPopperOptions?: PopperOptions;
  className?: string;
  tooltipClassName?: string;
  iconTitle?: string;
  showArrow?: boolean;
  invertedIcon?: boolean;
}

const QuestionMarkTooltip = ({
  iconTitle,
  tooltipClassName,
  tooltipTextValues,
  tooltipPopperOptions = {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-3, 10],
        },
      },
    ],
  },
  tooltipText,
  className,
  showArrow,
  invertedIcon,
}: Props) => {
  return (
    <Tooltip
      content={
        <div className={tooltipClassName}>
          {typeof tooltipText === 'string' ? (
            tooltipText
          ) : (
            <FormattedMessage {...tooltipText} values={tooltipTextValues} />
          )}
        </div>
      }
      trigger="hover"
      showArrow={showArrow}
      popperOptions={tooltipPopperOptions}
    >
      <div className={className}>
        <Icon
          name={invertedIcon ? 'question-mark-inverted' : 'question-mark'}
          appearance={{ size: 'extraSmall' }}
          title={iconTitle || ''}
        />
      </div>
    </Tooltip>
  );
};

QuestionMarkTooltip.displayName = displayName;

export default QuestionMarkTooltip;
