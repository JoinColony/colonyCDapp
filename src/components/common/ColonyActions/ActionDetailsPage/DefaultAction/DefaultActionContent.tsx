import React from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers';
import { Heading3 } from '~shared/Heading';
import { Colony, ColonyAction } from '~types';

import ActionsPageFeed from '../ActionDetailsPageFeed';

import styles from './DefaultAction.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultActionContent';

interface DefaultActionContentProps {
  colony: Colony;
  item: ColonyAction;
}

const DefaultActionContent = ({ colony, item }: DefaultActionContentProps) => (
  <div className={styles.content}>
    <Heading3
      className={styles.heading}
      data-test="actionHeading"
      text={{ id: 'action.title' }}
      textValues={getActionTitleValues(item, colony)}
    />
    <ActionsPageFeed actionData={item} />
  </div>
);

DefaultActionContent.displayName = displayName;

export default DefaultActionContent;
