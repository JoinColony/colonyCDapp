import { type State as PopperJsState } from '@popperjs/core';
import React, {
  type CSSProperties,
  type Dispatch,
  type FocusEvent,
  isValidElement,
  type SetStateAction,
  useMemo,
} from 'react';
import { type MessageDescriptor, useIntl } from 'react-intl';

import { type SimpleMessageValues } from '~types/index.ts';
import { getMainClasses } from '~utils/css/index.ts';

import getPopoverArrowClasses from './getPopoverArrowClasses.ts';
import {
  type PopoverAppearanceType,
  type PopoverContent as PopoverContentType,
} from './types.ts';

import styles from './PopoverWrapper.module.css';

interface Props {
  appearance?: PopoverAppearanceType;
  arrowRef: Dispatch<SetStateAction<HTMLElement | null>>;
  close: () => void;
  content: PopoverContentType;
  contentRef: Dispatch<SetStateAction<HTMLElement | null>>;
  contentValues?: SimpleMessageValues;
  onFocus: (evt: FocusEvent<HTMLElement>) => void;
  popperAttributes: Record<string, object | undefined>;
  popperStyles: Record<string, CSSProperties>;
  retainRefFocus?: boolean;
  showArrow: boolean;
  state: PopperJsState | null;
}

const displayName = 'PopoverWrapper';

const PopoverWrapper = ({
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
}: Props) => {
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
      className={`
        popoverWrapper
        ${getMainClasses(
          appearance,
          styles as unknown as { [k: string]: string },
          {
            hideArrow: !showArrow,
            showArrow,
          },
        )}
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
          className={getPopoverArrowClasses(
            appearance,
            // Use placement derived from popperjs so `auto` isn't used
            state.placement,
            styles as unknown as { [k: string]: string },
          )}
          ref={arrowRef}
          style={popperStyles.arrow}
        />
      )}
    </div>
  );
};

PopoverWrapper.displayName = displayName;

export default PopoverWrapper;
