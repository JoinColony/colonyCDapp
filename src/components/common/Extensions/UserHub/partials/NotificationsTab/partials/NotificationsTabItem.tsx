import React, { FC } from 'react';

import { NotificationsProps } from '../types';
import styles from './NotificationsTabItem.module.css';

const displayName =
  'common.Extensions.UserHub.partials.NotificationsTab.partials.NotificationsItems';

const NotificationsItems: FC<NotificationsProps> = ({
  title,
  date,
  text,
  read,
}) => {
  return (
    <li className={styles.notificationsItem}>
      <div className="relative w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center mr-2 flex-grow">
            <p className="text-1 mr-2">{title}</p>
            <span className="text-gray-400 text-xs">{date}</span>
          </div>
        </div>
        <div className="flex text-xs">
          <div className="font-medium mr-2">{text}</div>
          <div className="text-gray-600">{read && 'Unread'}</div>
        </div>
      </div>
    </li>
  );
};

NotificationsItems.displayName = displayName;

export default NotificationsItems;
