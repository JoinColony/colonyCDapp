import React, { FC, useState, KeyboardEvent } from 'react';
import { useMobile } from '~hooks';
import Icon from '~shared/Icon';
import { UserHubMobileProps } from './types';
import styles from './UserHub.module.css';

export const displayName = 'common.Extensions.UserHub.partials.UserHubMobile';

const UserHubMobile: FC<UserHubMobileProps> = ({ selectedTab, handleChange, tabList }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const isMobile = useMobile();

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
        handleChange(selectedTab - 1 >= 0 ? selectedTab - 1 : tabList.length - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleChange(selectedTab === tabList.length - 1 ? 0 : selectedTab + 1);
        break;
      default:
        break;
    }
  };

  const selectedItem = tabList.find((item) => item.id === selectedTab);

  return (
    <div className={`${isMobile ? 'pt-0' : 'pt-5'} ${styles.wrapper}`}>
      <div className={styles.container}>
        <button type="button" onClick={toggleOptions} className={styles.button}>
          {selectedItem?.label}
          <Icon
            name="caret-down"
            className={`${styles.icon} transition-transform duration-normal ${
              isOptionsOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
        <ul
          className={`${styles.options} ${isOptionsOpen ? styles.show : ''}`}
          tabIndex={-1}
          role="listbox"
          aria-activedescendant={tabList[selectedTab].id.toString()}
          onKeyDown={(event) => handleListKeyDown(event)}
        >
          {tabList?.map((option) => (
            <li
              className={`${styles.li} ${selectedTab === option.id ? 'bg-gray-100' : 'bg-none'}`}
              id={option.id.toString()}
              role="option"
              aria-selected={selectedTab === option.id}
              tabIndex={0}
              onKeyDown={handleKeyDown(option.id)}
              onClick={() => {
                handleChange(option.id);
                setIsOptionsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

UserHubMobile.displayName = displayName;

export default UserHubMobile;
