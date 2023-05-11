import React, { FC, isValidElement, useMemo } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import { PopoverWrapperProps } from './types';
import getPopoverArrowClasses from './getPopoverArrowClasses';

const displayName = 'Extensions.PopoverWrapper';

const PopoverWrapper: FC<PopoverWrapperProps> = ({
  appearance,
  arrowRef,
  close,
  content,
  contentRef,
  contentValues,
  onFocus,
  popperAttributes,
  popperStyles,
  retainRefFocus,
  showArrow,
  state,
}) => {
  const { formatMessage } = useIntl();
  const popoverContent = useMemo(() => {
    if (typeof content === 'string' || isValidElement(content)) {
      return content;
    }
    if (typeof content === 'function') {
      return content({ close });
    }
    return formatMessage(content as MessageDescriptor, contentValues);
  }, [close, content, contentValues, formatMessage]);

  return (
    <div
      className={`w-full max-w-[20rem] bg-base-white ${getMainClasses(appearance, {
        hideArrow: !showArrow,
        showArrow,
      })}
        `}
      onFocus={onFocus}
      ref={contentRef}
      role="tooltip"
      style={popperStyles.popper}
      tabIndex={retainRefFocus ? -1 : undefined}
      {...popperAttributes.popper}
    >
      {popoverContent}
      {state && state.placement && (
        <span
          className={getPopoverArrowClasses(appearance, state.placement)}
          ref={arrowRef}
          style={popperStyles.arrow}
        />
      )}
    </div>
  );
};

PopoverWrapper.displayName = displayName;

export default PopoverWrapper;
