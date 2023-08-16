import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '~shared/Icon';
import { AnyActionType, ExtendedColonyActionType } from '~types';
import { isSafeTransactionType } from '~utils/safes';

import { ACTION_TYPES_ICONS_MAP } from '../types';

import styles from './ActionTypeDetail.css';

const displayName = 'DetailsWidget.ActionTypeDetail';

interface ActionTypeDetailProps {
  actionType: AnyActionType;
}

const ActionTypeDetail = ({ actionType }: ActionTypeDetailProps) => {
  const iconName = isSafeTransactionType(actionType)
    ? ACTION_TYPES_ICONS_MAP[ExtendedColonyActionType.SafeTransaction]
    : ACTION_TYPES_ICONS_MAP[actionType];

  return (
    <>
      <Icon
        title={{ id: 'action.type' }}
        titleValues={{ actionType }}
        appearance={{ size: 'small' }}
        name={iconName ?? ''}
      />
      <div className={styles.text}>
        <FormattedMessage id="action.type" values={{ actionType }} />
      </div>
    </>
  );
};

ActionTypeDetail.displayName = displayName;

export default ActionTypeDetail;
