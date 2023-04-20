import React from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers';
import { Heading3 } from '~shared/Heading';
import { ColonyAction } from '~types';

import {
  ActionDetailsPageFeed,
  MotionDetailsPageFeed,
} from '../ActionDetailsPageFeed';

import styles from './DefaultAction.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultActionContent';

interface DefaultActionContentProps {
  actionData: ColonyAction;
}

const DefaultActionContent = ({ actionData }: DefaultActionContentProps) => (
  <div className={styles.content}>
    <Heading3
      className={styles.heading}
      data-test="actionHeading"
      text={{ id: 'action.title' }}
      textValues={getActionTitleValues(actionData)}
    />
    {actionData.isMotion ? (
      <MotionDetailsPageFeed actionData={actionData} />
    ) : (
      <ActionDetailsPageFeed actionData={actionData} />
    )}
  </div>
);

DefaultActionContent.displayName = displayName;

export default DefaultActionContent;
