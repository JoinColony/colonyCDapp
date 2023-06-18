import React, { ReactNode } from 'react';
import { PopperOptions } from 'react-popper-tooltip';
import classNames from 'classnames';

import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { Message, UniversalMessageValues } from '~types';
import { formatText } from '~utils/intl';

import styles from './DetailItem.css';

const displayName = 'DetailsWidget.DetailItem';

export interface DetailItemProps {
  label: Message;
  labelValues?: UniversalMessageValues;
  labelStyles?: string;
  item: ReactNode;
  tooltipText?: Message;
  tooltipStyles?: string;
  tooltipPopperOptions?: PopperOptions;
}

const DetailItem = ({
  label,
  labelValues,
  labelStyles,
  item,
  tooltipText,
  tooltipStyles = styles.tooltip,
  tooltipPopperOptions,
}: DetailItemProps) => (
  <div className={styles.item}>
    <div className={classNames(styles.label, labelStyles)}>
      {formatText(label, labelValues)}
      {tooltipText && (
        <QuestionMarkTooltip
          tooltipText={tooltipText}
          tooltipClassName={tooltipStyles}
          tooltipPopperOptions={tooltipPopperOptions}
        />
      )}
    </div>
    <div className={styles.value}>{item}</div>
  </div>
);

DetailItem.displayName = displayName;

export default DetailItem;
