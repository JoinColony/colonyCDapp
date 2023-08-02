import React from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers';
import { Heading3 } from '~shared/Heading';
import { Colony, ColonyAction } from '~types';

import {
  ActionDetailsPageFeed,
  MotionDetailsPageFeed,
} from '../ActionDetailsPageFeed';

import ActionAnnotation from './ActionAnnotation';

import styles from './DefaultActionContent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultActionContent';

interface DefaultActionContentProps {
  actionData: ColonyAction;
  colony: Colony;
}

const DefaultActionContent = ({
  actionData: { annotation, motionData },
  actionData,
  colony,
}: DefaultActionContentProps) => {
  const { objectionAnnotation } = motionData ?? {};
  return (
    <div className={styles.content}>
      <Heading3
        className={styles.heading}
        data-test="actionHeading"
        text={{ id: 'action.title' }}
        textValues={getActionTitleValues(actionData, colony)}
      />
      <div className={styles.annotations}>
        {annotation && <ActionAnnotation annotation={annotation} />}
        {objectionAnnotation && (
          <ActionAnnotation annotation={objectionAnnotation} isObjection />
        )}
      </div>
      {actionData.isMotion ? (
        <MotionDetailsPageFeed actionData={actionData} />
      ) : (
        <ActionDetailsPageFeed actionData={actionData} />
      )}
    </div>
  );
};

DefaultActionContent.displayName = displayName;

export default DefaultActionContent;
