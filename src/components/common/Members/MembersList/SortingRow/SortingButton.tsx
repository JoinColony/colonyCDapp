import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import classnames from 'classnames';

import Button from '~shared/Button';
import Icon from '~shared/Extensions/Icon';
import { SortingMethod } from '~gql';
import styles from './SortingButton.css';

export interface Props {
  isSortingByRep: boolean;
  nextSortingMethod: SortingMethod;
  handleSortingMethodChange: React.Dispatch<React.SetStateAction<SortingMethod>>;
  message: MessageDescriptor;
  caretUp: boolean;
}

const displayName = 'MembersList.SortingRow.SortingButton';

const SortingButton = ({ isSortingByRep, nextSortingMethod, handleSortingMethodChange, message, caretUp }: Props) => {
  return (
    <Button className={styles.sortingButton} onClick={() => handleSortingMethodChange(nextSortingMethod)}>
      <FormattedMessage {...message} />
      <Icon
        className={classnames(styles.sortingIcon, {
          [styles.toggledIcon]: !isSortingByRep,
        })}
        name={caretUp ? 'caret-up' : 'caret-down'}
        title={message}
      />
    </Button>
  );
};

SortingButton.displayName = displayName;

export default SortingButton;
