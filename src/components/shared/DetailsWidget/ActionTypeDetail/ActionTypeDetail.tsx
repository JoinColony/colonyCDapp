import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '~shared/Icon';
import { AnyActionType } from '~types';

import { ACTION_TYPES_ICONS_MAP } from '../types';

import styles from './ActionTypeDetail.css';

const displayName = 'DetailsWidget.ActionTypeDetail';

interface ActionTypeDetailProps {
  actionType: AnyActionType;
}

const ActionTypeDetail = ({ actionType }: ActionTypeDetailProps) => (
  <>
    <Icon
      title={{ id: 'action.type' }}
      titleValues={{ actionType }}
      appearance={{ size: 'small' }}
      name={ACTION_TYPES_ICONS_MAP[actionType] ?? ''}
    />
    <div className={styles.text}>
      <FormattedMessage id="action.type" values={{ actionType }} />
    </div>
  </>
);

ActionTypeDetail.displayName = displayName;

export default ActionTypeDetail;
