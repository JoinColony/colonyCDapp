import React from 'react';

import styles from './EventData.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.EventData';

interface EventDataProps {
  text: JSX.Element;
  details: JSX.Element;
}

const EventData = ({ text, details }: EventDataProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.text} data-test="actionsEventText">
        {text}
      </div>
      <div className={styles.details}>{details}</div>
    </div>
  );
};

EventData.displayName = displayName;

export default EventData;
