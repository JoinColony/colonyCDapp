import { nanoid } from 'nanoid';
import React, { ReactNode } from 'react';
import { FormattedDateParts } from 'react-intl';

import { Message, UniversalMessageValues } from '~types';
import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';
import { MOTION_TAG_MAP, MotionState } from '~utils/colonyMotions';

import styles from './ListItem.css';

const displayName = 'ListItem';

export enum ListItemStatus {
  NeedAction = 'NeedAction',
  NeedAttention = 'NeedAttention',
  Draft = 'Draft',
  // Default status, does not do anything
  Defused = 'Defused',
}

const stopPropagation = (
  e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
) => e.stopPropagation();

interface FormattedDateProps {
  parts: {
    value: string;
  }[];
}

const FormattedDate = ({ parts }: FormattedDateProps) => (
  <>
    <span className={styles.day}>{parts[2].value}</span>
    <span>{parts[0].value}</span>
  </>
);

interface ListItemProps {
  /** Avatar to be displayed */
  avatar?: ReactNode;
  /** The date the corresponding event was created */
  createdAt?: string | number | Date;
  /** To be displayed at the end of the list item, e.g. a countdown timer */
  extra?: ReactNode;
  /** Metadata to be displayed beneath the item title. */
  meta?: ReactNode;
  /** A click handler for the list item */
  onClick?: (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  /** An ItemStatus. Styles the list item's 'before' psuedo-element. */
  status?: ListItemStatus;
  /** The tag to be displayed next to the title */
  tag?: ReactNode;
  /** A title */
  title: Message;
  /** Values for the react-intl interpolation */
  titleValues: UniversalMessageValues;
}

const ListItem = ({
  avatar,
  createdAt,
  extra,
  meta,
  onClick,
  status = ListItemStatus.Defused,
  title,
  titleValues,
  tag,
}: ListItemProps) => (
  <li>
    <div
      className={getMainClasses({}, styles, {
        [ListItemStatus[status]]: !!status,
      })}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      <div
        className={styles.avatar}
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
        role="button"
        tabIndex={0}
      >
        {avatar}
      </div>
      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <span className={styles.title} key={nanoid()}>
            {formatText(title, titleValues)}
          </span>
          {tag && <div className={styles.motionTagWrapper}>{tag}</div>}
        </div>
        <div className={styles.meta}>
          <FormattedDateParts value={createdAt} month="short" day="numeric">
            {(parts) => <FormattedDate parts={parts} />}
          </FormattedDateParts>
          {meta}
        </div>
      </div>
      {extra}
    </div>
  </li>
);

ListItem.displayName = displayName;

export default ListItem;
