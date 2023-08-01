import React from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers';
import { Heading3 } from '~shared/Heading';
import { Colony, ColonyAction } from '~types';

import {
  ActionDetailsPageFeed,
  MotionDetailsPageFeed,
} from '../ActionDetailsPageFeed';
import Decision from '../Decision';

import ActionAnnotation from './ActionAnnotation';

import styles from './DefaultActionContent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultActionContent';

interface DefaultActionContentProps {
  actionData: ColonyAction;
  colony: Colony;
}

const DefaultActionContent = ({
  actionData: { annotation, motionData, isMotion, decisionData },
  actionData,
  colony,
}: DefaultActionContentProps) => {
  const { objectionAnnotation } = motionData ?? {};
  return (
    <div className={styles.content}>
      {decisionData ? (
        <Decision decisionData={decisionData} />
      ) : (
        <div>
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
          {isMotion ? (
            <MotionDetailsPageFeed actionData={actionData} />
          ) : (
            <ActionDetailsPageFeed actionData={actionData} />
          )}
        </div>
      )}
    </div>
  );
};

DefaultActionContent.displayName = displayName;

export default DefaultActionContent;
