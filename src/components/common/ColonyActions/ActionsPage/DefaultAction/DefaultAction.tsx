import React from 'react';

import { Heading3 } from '~shared/Heading';
import { MotionTag } from '~shared/Tag';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';

import styles from './DefaultAction.css';

const displayName = 'common.ColonyActions.DefaultAction';

const DefaultAction = () => {
  const isVotingExtensionEnabled = false;
  const motionStyles = MOTION_TAG_MAP[MotionState.Forced];

  //   const headingText =
  //     (verifiedAddressesChanged &&
  //       `action.${ColonyActions.ColonyEdit}.verifiedAddresses`) ||
  //     (tokensChanged && `action.${ColonyActions.ColonyEdit}.tokens`) ||
  //     roleMessageDescriptorId ||
  //     'action.title';

  return (
    <div className={styles.main}>
      {/*{isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
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
            text={'action.title'}
            // textValues={{
            //   ...actionAndEventValues,
            //   fromDomain: actionAndEventValues.fromDomain?.name,
            //   toDomain: actionAndEventValues.toDomain?.name,
            //   roles: roleTitle,
            // }}
          />
          {/* <ActionsPageFeed
            actionType={actionType}
            transactionHash={transactionHash as string}
            networkEvents={events}
            values={actionAndEventValues}
            actionData={colonyAction}
            colony={colony}
          /> */}
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
        {/* <div className={styles.details}>
          <DetailsWidget
            actionType={actionType as ColonyActions}
            recipient={recipient}
            transactionHash={transactionHash}
            values={actionAndEventValues}
            colony={colony}
          />
        </div> */}
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
