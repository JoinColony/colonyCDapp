import React, { useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import { useIntl } from 'react-intl';
import useToggle from '~hooks/useToggle';
import Card from '~v5/shared/Card';
import { CardSelectProps } from './types';
import { FIELD_STATE } from '../consts';

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
}: CardSelectProps<TValue>): JSX.Element {
  const intl = useIntl();

  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff, registerContainerRef },
  ] = useToggle();
  const [uncontrolledValue, setUncontrolledValue] = useState<TValue>();
  const uncontrolledOnChange = useCallback((newValue: TValue) => {
    setUncontrolledValue(newValue);
  }, []);

  const value = valueProp ?? uncontrolledValue;
  const onChange = onChangeProp ?? uncontrolledOnChange;

  const selectedOption = useMemo(() => {
    if (value === undefined) {
      return undefined;
    }

    return options.find((option) => valueComparator(option.value, value));
  }, [options, value, valueComparator]);

  return (
    <div className="sm:relative w-full">
      <button
        type="button"
        className={clsx(
          'flex capitalize text-md md:transition-colors md:hover:text-blue-400',
          {
            'placeholder:gray-500': !state,
            'placeholder:negative-400': state === FIELD_STATE.Error,
          },
        )}
        onClick={toggleSelect}
      >
        {selectedOption?.label ||
          placeholder ||
          intl.formatMessage({ id: 'common.fields.cardSelect.placeholder' })}
      </button>
      {isSelectVisible && (
        <Card
          ref={registerContainerRef}
          className="p-6 w-full sm:max-w-[13rem] absolute top-[calc(100%+0.5rem)] left-0 z-50"
          hasShadow
          rounded="s"
        >
          {title && (
            <h5 className="text-4 text-gray-400 mb-4 uppercase">{title}</h5>
          )}
          <ul>
            {options.map(({ label, value: optionValue, ariaLabel }) => (
              <li key={keyExtractor(optionValue)} className="mb-4 last:mb-0">
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
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

CardSelect.displayName = displayName;

export default CardSelect;
