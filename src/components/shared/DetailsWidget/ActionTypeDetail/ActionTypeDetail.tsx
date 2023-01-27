import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '~shared/Icon';
import { ColonyMotions } from '~types';
import { EventValues } from '~utils/colonyActions';

import { ACTION_TYPES_ICONS_MAP } from '../types';

import styles from './ActionTypeDetail.css';

const displayName = 'DetailsWidget.ActionTypeDetail';

interface ActionTypeDetailProps {
  actionType: EventValues['actionType'];
}

const ActionTypeDetail = ({ actionType }: ActionTypeDetailProps) => {
  const messageId = ColonyMotions[actionType] ? 'motion.type' : 'action.type';

  return (
    <>
      <Icon
        title={{ id: messageId }}
        titleValues={{ actionType }}
        appearance={{ size: 'small' }}
        name={ACTION_TYPES_ICONS_MAP[actionType]}
      />
      <div className={styles.text}>
        <FormattedMessage id={messageId} values={{ actionType }} />
      </div>
    </>
  );
};

ActionTypeDetail.displayName = displayName;

export default ActionTypeDetail;
