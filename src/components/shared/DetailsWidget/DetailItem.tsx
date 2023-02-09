import React, { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { UniversalMessageValues } from '~types';
import { formatText } from '~utils/intl';

import styles from './DetailItem.css';

const displayName = 'DetailsWidget.DetailItem';

interface DetailItemProps {
  label: MessageDescriptor;
  labelValues?: UniversalMessageValues;
  item: ReactNode;
}

const DetailItem = ({ label, labelValues, item }: DetailItemProps) => (
  <div className={styles.item}>
    <div className={styles.label}>{formatText(label, labelValues)}</div>
    <div className={styles.value}>{item}</div>
  </div>
);

DetailItem.displayName = displayName;

export default DetailItem;
