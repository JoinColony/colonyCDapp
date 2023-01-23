import React, { ReactNode } from 'react';
import { FormattedDateParts } from 'react-intl';

import Tag, { Appearance as TagAppearance } from '~shared/Tag';
import { Message } from '~types';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';
import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';

import styles from './ListItem.css';

const displayName = 'ListItem';

export enum ListItemStatus {
  NeedAction = 'NeedAction',
  NeedAttention = 'NeedAttention',
  Draft = 'Draft',
  // Default status, does not do anything
  Defused = 'Defused',
}

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
  /** To be displayed at the end of the list item, e.g. a countdown timer */
  actions?: ReactNode;
  /** Avatar to be displayed */
  avatar?: ReactNode;
  /** The date the corresponding event was created */
  createdAt?: string | number | Date;
  /** Metadata to be displayed beneath the item title. */
  meta?: ReactNode;
  /** A click handler for the list item */
  onClick?: (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  /** An ItemStatus. Styles the list item's 'before' psuedo-element. */
  status?: ListItemStatus;
  /** A title */
  title: Message;
  /** The tag to be displayed next to the title */
  tag: MotionState;
}

const ListItem = ({
  actions,
  avatar,
  createdAt,
  meta,
  onClick,
  status = ListItemStatus.Defused,
  title,
  tag,
}: ListItemProps) => {
  const tagStyles = MOTION_TAG_MAP[tag];

  return (
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
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="button"
          tabIndex={0}
        >
          {avatar}
        </div>
        <div className={styles.content}>
          <div className={styles.titleWrapper}>
            <span className={styles.title}>{formatText(title)}</span>
            <div className={styles.motionTagWrapper}>
              <Tag
                text={tagStyles.name}
                appearance={{
                  theme: tagStyles.theme as TagAppearance['theme'],
                  colorSchema:
                    tagStyles.colorSchema as TagAppearance['colorSchema'],
                }}
              />
            </div>
          </div>
          <div className={styles.meta}>
            <FormattedDateParts value={createdAt} month="short" day="numeric">
              {(parts) => <FormattedDate parts={parts} />}
            </FormattedDateParts>
            {meta}
          </div>
        </div>
        {actions}
      </div>
    </li>
  );
};

ListItem.displayName = displayName;

export default ListItem;
