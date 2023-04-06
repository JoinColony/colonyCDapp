import React from 'react';
import { defineMessages } from 'react-intl';

import { ColonyActionType } from '~gql';
import { Heading4 } from '~shared/Heading';
import { formatText } from '~utils/intl';

import styles from './VotingWidgetHeading.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidgetHeading';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `Should "{actionType}" be approved?`,
  },
});

interface VotingWidgetHeadingProps {
  actionType: ColonyActionType;
}

const VotingWidgetHeading = ({ actionType }: VotingWidgetHeadingProps) => {
  const formattedActionType = formatText({ id: 'action.type' }, { actionType });
  return (
    <div className={styles.main}>
      <Heading4
        text={MSG.title}
        textValues={{
          actionType: formattedActionType,
        }}
        appearance={{ weight: 'bold', theme: 'dark', margin: 'none' }}
      />
    </div>
  );
};

VotingWidgetHeading.displayName = displayName;

export default VotingWidgetHeading;
