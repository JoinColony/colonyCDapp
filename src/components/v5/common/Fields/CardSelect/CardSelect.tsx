import clsx from 'clsx';
import React, { useCallback, useId, useMemo, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { formatText } from '~utils/intl.ts';
import HoverWidthWrapper from '~v5/shared/HoverWidthWrapper/index.ts';
import MenuContainer from '~v5/shared/MenuContainer/MenuContainer.tsx';
import PopoverBase from '~v5/shared/PopoverBase/PopoverBase.tsx';

import { FieldState } from '../consts.ts';

import { OPTION_LIST_ITEM_CLASSES } from './consts.ts';
import { type CardSelectOptionsGroup, type CardSelectProps } from './types.ts';
import { isFlatOptions } from './utils.ts';

const displayName = 'v5.common.Fields.CardSelect';

function CardSelect<TValue = string>({
  // eslint-disable-next-line no-warning-comments
  // TODO: add support for message when needed
  // message,
  cardClassName,
  options,
  onChange: onChangeProp,
  value: valueProp,
  title,
  keyExtractor = (v) => String(v),
  valueComparator = (v1, v2) => v1 === v2,
  state,
  placeholder,
  renderSelectedValue,
  togglerClassName,
  footer,
  disabled,
  readonly,
  itemClassName = 'group flex text-md md:transition-colors md:hover:font-medium md:hover:bg-gray-50 rounded px-4 py-2 w-full cursor-pointer',
  renderOptionWrapper = (props, children) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}: CardSelectProps<TValue>): JSX.Element {
  const [uncontrolledValue, setUncontrolledValue] = useState<TValue>();
  const uncontrolledOnChange = useCallback((newValue: TValue) => {
    setUncontrolledValue(newValue);
  }, []);
  const defaultGroupKey = useId();
  const groupedOptions = useMemo<CardSelectOptionsGroup<TValue>[]>(() => {
    if (isFlatOptions(options)) {
      return [
        {
          key: defaultGroupKey,
          title,
          options,
        },
      ];
    }

    if (title) {
      console.warn(
        'CardSelect: title prop is ignored when options are grouped',
      );
    }

    return options;
  }, [defaultGroupKey, options, title]);

  const value = valueProp ?? uncontrolledValue;
  const onChange = onChangeProp ?? uncontrolledOnChange;

  const selectedOption = useMemo(() => {
    if (value === undefined) {
      return undefined;
    }

    return groupedOptions
      .flatMap((group) => group.options)
      .find((option) => valueComparator(option.value, value));
  }, [groupedOptions, value, valueComparator]);

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip({
      placement: 'bottom-start',
      trigger: ['click'],
      interactive: true,
      closeOnOutsideClick: true,
    });

  const selectPlaceholder =
    placeholder || formatText({ id: 'common.fields.cardSelect.placeholder' });

  return (
    <div className="w-full sm:relative">
      {readonly || disabled ? (
        <span
          className={clsx('text-md', {
            'text-gray-300': disabled,
            'text-gray-900': readonly,
          })}
        >
          {renderSelectedValue
            ? renderSelectedValue(selectedOption, selectPlaceholder)
            : selectedOption?.label || selectPlaceholder}
        </span>
      ) : (
        <>
          <button
            ref={setTriggerRef}
            type="button"
            className={clsx(
              togglerClassName,
              'flex text-left text-md md:transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !state && !visible,
                'text-gray-900': value && !visible,
                'text-negative-400': state === FieldState.Error,
                'text-blue-400': visible,
              },
            )}
          >
            {renderSelectedValue
              ? renderSelectedValue(selectedOption, selectPlaceholder, visible)
              : selectedOption?.label || selectPlaceholder}
          </button>
          {visible && (
            <PopoverBase
              className={cardClassName}
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
            >
              <MenuContainer
                className={clsx(
                  cardClassName,
                  'w-full max-w-[calc(100%-2.25rem)] overflow-auto px-2 py-4 sm:w-auto sm:max-w-none',
                )}
                hasShadow
                rounded="s"
              >
                <ul>
                  {groupedOptions.map((group) => (
                    <li key={group.key} className={OPTION_LIST_ITEM_CLASSES}>
                      {group.title && (
                        <h5 className="section-title px-4 py-2 uppercase text-gray-400 text-4">
                          {group.title}
                        </h5>
                      )}
                      {!!group.options.length && (
                        <ul>
                          {group.options.map(
                            ({ label, value: optionValue, ariaLabel }) => (
                              <li key={keyExtractor(optionValue)}>
                                <HoverWidthWrapper
                                  hoverClassName="font-medium block"
                                  hoverElement="div"
                                >
                                  {renderOptionWrapper(
                                    {
                                      className: itemClassName,
                                      'aria-label': ariaLabel,
                                      onClick: () => {
                                        onChange(optionValue);
                                        triggerRef?.click();
                                      },
                                    },
                                    label,
                                  )}
                                </HoverWidthWrapper>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                  {footer && (
                    <li className={OPTION_LIST_ITEM_CLASSES}>
                      {typeof footer === 'function'
                        ? footer(() => triggerRef?.click())
                        : footer}
                    </li>
                  )}
                </ul>
              </MenuContainer>
            </PopoverBase>
          )}
        </>
      )}
    </div>
  );
}

CardSelect.displayName = displayName;

export default CardSelect;
