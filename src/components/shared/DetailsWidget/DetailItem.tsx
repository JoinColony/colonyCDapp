import React, { ReactNode } from 'react';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import { Message, UniversalMessageValues } from '~types';
import { formatText } from '~utils/intl';

import styles from './DetailItem.css';

const displayName = 'DetailsWidget.DetailItem';

interface DetailItemProps {
  label: Message;
  labelValues?: UniversalMessageValues;
  item: ReactNode;
  tooltipText?: Message;
  tooltipStyles?: string;
}

const DetailItem = ({
  label,
  labelValues,
  item,
  tooltipText,
  tooltipStyles = styles.tooltip,
}: DetailItemProps) => (
  <div className={styles.item}>
    <div className={styles.label}>
      {formatText(label, labelValues)}
      {tooltipText && (
        <QuestionMarkTooltip
          tooltipText={tooltipText}
          tooltipClassName={tooltipStyles}
          tooltipPopperOptions={{
            placement: 'right',
          }}
        />
      )}
    </div>
    <div className={styles.value}>{item}</div>
  </div>
);

DetailItem.displayName = displayName;

export default DetailItem;
