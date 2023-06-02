import React, { useState, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { SelectProps } from './types';
import styles from './Select.module.css';
import Icon from '~shared/Icon';
import NavLink from '~shared/Extensions/NavLink';

const displayName = 'Extensions.Select';

const Select = <T extends any[]>({ list, selectedElement, handleChange }: SelectProps<T>) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const setSelectedThenCloseDropdown = (index: number) => {
    handleChange(index);
    setIsOptionsOpen(false);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLElement>) => {
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
        handleChange(selectedElement - 1 >= 0 ? selectedElement - 1 : list.length - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleChange(selectedElement === list.length - 1 ? 0 : selectedElement + 1);
        break;
      default:
        break;
    }
  };

  const selectedItem = list.find((item) => item.id === selectedElement);
  const filteredList = list.filter((item) => item.value !== selectedItem.value);

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={toggleOptions}
        className={clsx(styles.button, {
          'border border-blue-400': isOptionsOpen,
          'border border-gray-300 ': !isOptionsOpen,
        })}
      >
        {selectedItem?.label}
        <Icon
          name="caret-down"
          className={clsx(`${styles.icon} transition-transform duration-normal`, {
            'rotate-180': isOptionsOpen,
            'rotate-0': !isOptionsOpen,
          })}
        />
      </button>
      <ul
        className={`${styles.options} ${isOptionsOpen ? styles.show : ''}`}
        tabIndex={-1}
        role="listbox"
        aria-activedescendant={list[selectedElement].id.toString()}
        onKeyDown={(event) => handleListKeyDown(event)}
      >
        {filteredList?.map((option) => (
          <li
            key={option.id}
            className={clsx(styles.li, {
              'text-blue-400 font-medium': selectedElement === option.id,
              'text-gray-900': selectedElement !== option.id,
            })}
            id={option.id.toString()}
            role="option"
            aria-selected={selectedElement === option.id}
            tabIndex={0}
            onKeyDown={handleKeyDown(option.id)}
            onClick={() => {
              handleChange(option.id);
              setIsOptionsOpen(false);
            }}
          >
            {option.linkTo ? (
              <NavLink className="flex items-center w-full text-inherit py-2" to={option.linkTo}>
                {option.label}
              </NavLink>
            ) : (
              <span className="py-2">{option.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

Select.displayName = displayName;

export default Select;
