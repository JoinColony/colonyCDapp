import React from 'react';

import { getActionTitleValues } from '~common/ColonyActions/helpers';
import { Heading3 } from '~shared/Heading';
import { Colony, ColonyAction } from '~types';
import { DecisionContent } from '~common/ColonyDecisions/DecisionPreview/DecisionData';
import TimeRelative from '~shared/TimeRelative/TimeRelative';
import { useNetworkInverseFee } from '~hooks';

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
  actionData: { annotation, motionData, isMotion, decisionData },
  actionData,
  colony,
}: DefaultActionContentProps) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { objectionAnnotation } = motionData ?? {};

  if (decisionData) {
    return (
      <div className={styles.content}>
        <DecisionContent
          title={decisionData.title}
          description={decisionData.description}
          time={
            <span className={styles.time}>
              <TimeRelative value={new Date(decisionData.createdAt)} />
            </span>
          }
        />
        {objectionAnnotation && (
          <DecisionContent
            isObjection
            description={objectionAnnotation.message}
            time={
              <span className={styles.time}>
                <TimeRelative value={new Date(objectionAnnotation.createdAt)} />
              </span>
            }
          />
        )}
        <MotionDetailsPageFeed actionData={actionData} />
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <Heading3
        className={styles.heading}
        data-test="actionHeading"
        text={{ id: 'action.title' }}
        textValues={getActionTitleValues(actionData, colony, networkInverseFee)}
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
  );
};

DefaultActionContent.displayName = displayName;

export default DefaultActionContent;
