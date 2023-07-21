import React, { useState, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { SelectProps } from './types';
import styles from './Select.module.css';
import Icon from '~shared/Icon';
import NavLink from '~v5/shared/NavLink';
import Avatar from '~v5/shared/Avatar';

const displayName = 'v5.common.Fields.Select';

const Select = <T extends any[]>({
  list,
  selectedElement,
  handleChange,
  placeholderText,
  isLoading,
  isListRelative,
  showAvatar,
  openButtonClass,
}: SelectProps<T>) => {
  const { formatMessage } = useIntl();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(!!placeholderText);
  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const setSelectedThenCloseDropdown = (index: number) => {
    handleChange(index);
    setIsOptionsOpen(false);
  };

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case ' ':
        case 'SpaceBar':
        case 'Enter':
          event.preventDefault();
          setSelectedThenCloseDropdown(index);
          break;
        default:
          break;
      }
    };

  const handleListKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setIsOptionsOpen(false);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (selectedElement) {
          handleChange(
            selectedElement - 1 >= 0 ? selectedElement - 1 : list.length - 1,
          );
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (selectedElement) {
          handleChange(
            selectedElement === list.length - 1 ? 0 : selectedElement + 1,
          );
        }
        break;
      default:
        break;
    }
  };

  const selectedItem =
    !isLoading && list.find(({ id }) => id === selectedElement);
  const filteredList =
    !isLoading &&
    selectedItem &&
    list.filter(({ value }) => value !== selectedItem.value);
  const optionsList = isPlaceholder ? list : filteredList;
  const placeholder =
    typeof placeholderText === 'string'
      ? placeholderText
      : placeholderText && formatMessage(placeholderText);

  const labelText = isPlaceholder ? placeholder : selectedItem?.label;

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={toggleOptions}
        className={clsx(styles.button, isOptionsOpen && openButtonClass, {
          'border-blue-400': isOptionsOpen && !openButtonClass,
          'border-gray-300 ': !isOptionsOpen,
        })}
        aria-label={formatMessage({
          id: isOptionsOpen
            ? 'ariaLabel.closeDropdown'
            : 'ariaLabel.openDropdown',
        })}
      >
        <div className="flex items-center">
          {!isLoading && showAvatar && !isPlaceholder && (
            <div className="mr-2 flex">
              <Avatar
                avatar={selectedItem?.avatar || ''}
                placeholderIcon="circle-person"
              />
            </div>
          )}
          {isLoading ? formatMessage({ id: 'loading.data' }) : labelText}
        </div>
        <span
          className={clsx(
            'flex shrink-0 text-gray-400 transition-transform duration-normal',
            {
              'rotate-180': isOptionsOpen,
              'rotate-0': !isOptionsOpen,
            },
          )}
        >
          <Icon name="caret-down" appearance={{ size: 'extraTiny' }} />
        </span>
      </button>
      {!isLoading && (
        <ul
          className={clsx(styles.options, {
            relative: isListRelative,
            [styles.show]: isOptionsOpen,
          })}
          tabIndex={-1}
          role="listbox"
          aria-activedescendant={
            selectedElement && list[selectedElement]?.id.toString()
          }
          onKeyDown={(event) => handleListKeyDown(event)}
        >
          {optionsList?.map(({ id, linkTo, label, avatar }) => (
            <li
              key={id}
              className={clsx(styles.li, {
                'text-blue-400 font-medium': selectedElement === id,
                'text-gray-900': selectedElement !== id,
              })}
              id={id.toString()}
              role="option"
              aria-selected={selectedElement === id}
              tabIndex={0}
              onKeyDown={handleKeyDown(id)}
              onClick={() => {
                handleChange(id);
                setIsOptionsOpen(false);
                setIsPlaceholder(false);
              }}
            >
              {linkTo ? (
                <NavLink
                  className="flex items-center w-full text-inherit py-2"
                  to={linkTo}
                >
                  {label}
                </NavLink>
              ) : (
                <div className="py-2 flex items-center">
                  {showAvatar && (
                    <div className="mr-2 flex">
                      <Avatar
                        avatar={avatar || ''}
                        placeholderIcon="circle-person"
                      />
                    </div>
                  )}
                  {label}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Select.displayName = displayName;

export default Select;
