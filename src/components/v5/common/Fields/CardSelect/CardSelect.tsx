import React, { useCallback, useId, useMemo, useState } from 'react';

import clsx from 'clsx';
import useToggle from '~hooks/useToggle';
import Card from '~v5/shared/Card';
import { CardSelectOptionsGroup, CardSelectProps } from './types';
import { FIELD_STATE } from '../consts';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import Portal from '~v5/shared/Portal';
import { formatText } from '~utils/intl';
import { isFlatOptions } from './utils';
import { OPTION_LIST_ITEM_CLASSES } from './consts';

const displayName = 'v5.common.Fields.CardSelect';

function CardSelect<TValue = string>({
  // eslint-disable-next-line no-warning-comments
  // TODO: add support for message when needed
  // message,
  options,
  onChange: onChangeProp,
  value: valueProp,
  title,
  keyExtractor = (v) => String(v),
  valueComparator = (v1, v2) => v1 === v2,
  state,
  placeholder,
  renderSelectedValue,
  cardClassName,
  togglerClassName,
  footer,
  disabled,
  readonly,
}: CardSelectProps<TValue>): JSX.Element {
  const cardSelectToggle = useToggle();
  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff, registerContainerRef },
  ] = cardSelectToggle;
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

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isSelectVisible], {
    top: 8,
  });

  const selectPlaceholder =
    placeholder || formatText({ id: 'common.fields.cardSelect.placeholder' });

  return (
    <div className="sm:relative w-full">
      {readonly || disabled ? (
        <span
          className={clsx('text-md', {
            'text-gray-400': disabled,
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
            ref={relativeElementRef}
            type="button"
            className={clsx(
              togglerClassName,
              'flex text-md md:transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !state,
                'text-gray-900': value,
                'text-negative-400': state === FIELD_STATE.Error,
              },
            )}
            onClick={toggleSelect}
          >
            {renderSelectedValue
              ? renderSelectedValue(
                  selectedOption,
                  selectPlaceholder,
                  isSelectVisible,
                )
              : selectedOption?.label || selectPlaceholder}
          </button>
          {isSelectVisible && (
            <Portal>
              <Card
                ref={(ref) => {
                  registerContainerRef(ref);
                  portalElementRef.current = ref;
                }}
                className={clsx(
                  cardClassName,
                  'p-6 absolute z-[60] overflow-auto',
                )}
                hasShadow
                rounded="s"
              >
                <ul>
                  {groupedOptions.map((group) => (
                    <li key={group.key} className={OPTION_LIST_ITEM_CLASSES}>
                      {group.title && (
                        <h5 className="text-4 text-gray-400 mb-2 uppercase">
                          {group.title}
                        </h5>
                      )}
                      {!!group.options.length && (
                        <ul>
                          {group.options.map(
                            ({ label, value: optionValue, ariaLabel }) => (
                              <li
                                key={keyExtractor(optionValue)}
                                className="mb-2 last:mb-0"
                              >
                                <button
                                  type="button"
                                  className="flex text-md md:transition-colors md:hover:text-blue-400"
                                  aria-label={ariaLabel}
                                  onClick={() => {
                                    onChange(optionValue);
                                    toggleSelectOff();
                                  }}
                                >
                                  {label}
                                </button>
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
                        ? footer(cardSelectToggle)
                        : footer}
                    </li>
                  )}
                </ul>
              </Card>
            </Portal>
          )}
        </>
      )}
    </div>
  );
}

CardSelect.displayName = displayName;

export default CardSelect;
