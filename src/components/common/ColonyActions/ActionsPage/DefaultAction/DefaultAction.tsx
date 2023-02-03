import React from 'react';

import { getActionTitleValues } from '~common/ColonyActions';
import { mockEventData } from '~common/ColonyActions/mockData';
import DetailsWidget from '~shared/DetailsWidget';
import { Heading3 } from '~shared/Heading';
import { MotionTag } from '~shared/Tag';

import { useColonyContext } from '~hooks';
import { FormattedAction } from '~types';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';

import ActionsPageFeed from '../ActionsPageFeed';

import styles from './DefaultAction.css';

const displayName = 'common.ColonyActions.DefaultAction';

interface DefaultActionProps {
  item: FormattedAction;
}

const DefaultAction = ({ item }: DefaultActionProps) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const isVotingExtensionEnabled = false;
  const motionStyles = MOTION_TAG_MAP[MotionState.Forced];

  return (
    <div className={styles.main}>
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {isVotingExtensionEnabled && (
        <div className={styles.upperContainer}>
          <p className={styles.tagWrapper}>
            <MotionTag motionStyles={motionStyles} />
          </p>
        </div>
      )}
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          <Heading3
            className={styles.heading}
            data-test="actionHeading"
            text={{ id: 'action.title' }}
            textValues={getActionTitleValues(item, colony)}
          />
          <ActionsPageFeed actionData={item} />
          {/*
           *  @NOTE A user can comment only if he has a wallet connected
           * and a registered user profile
           
          {currentUserName && !ethereal && (
            <div className={styles.commentBox}>
              <CommentInput
                transactionHash={transactionHash}
                colonyAddress={colonyAddress}
              />
            </div>
          )}
          */}
        </div>
        <div className={styles.details}>
          <DetailsWidget
            actionType={item.actionType}
            recipientAddress={item.recipient.walletAddress}
            transactionHash={item.transactionHash}
            values={{ ...mockEventData, ...item }}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
