import React, { ReactElement } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import Heading from '~shared/Heading';
import Link from '~shared/Extensions/Link';

import { CREATE_COLONY_ROUTE } from '~routes/index';
import { WatchedColony } from '~types';
import { notNull } from '~utils/arrays';

import ColonyGridItem from './ColonyGridItem';

import styles from './ColonyGrid.css';

const displayName = 'common.ColonyGrid';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Colonies',
  },
  emptyText: {
    id: `${displayName}.emptyText`,
    defaultMessage: `It looks like you don't have any colonies. You’ll need an invite link to join a colony. Ask your community for a link or {link}.`,
  },
  createColonyLink: {
    id: `${displayName}.createColonyLink`,
    defaultMessage: `create a new colony`,
  },
});

interface Props {
  colonies?: { colony: WatchedColony }[];
  emptyStateDescription?: MessageDescriptor;
  emptyStateDescriptionValues?: { [key: string]: ReactElement };
}

const ColonyGrid = ({
  colonies = [],
  emptyStateDescription = MSG.emptyText,
  emptyStateDescriptionValues = {
    link: (
      <Link
        to={CREATE_COLONY_ROUTE}
        text={MSG.createColonyLink}
        className={styles.createColonyLink}
      />
    ),
  },
}: Props) =>
  colonies.length === 0 ? (
    <p className={styles.emptyText}>
      <FormattedMessage
        {...emptyStateDescription}
        values={emptyStateDescriptionValues}
      />
    </p>
  ) : (
    <div className={styles.main}>
      <div className={styles.sectionTitle}>
        <Heading text={MSG.title} appearance={{ size: 'medium' }} />
      </div>
      <div className={styles.colonyGrid}>
        {colonies
          .filter(notNull)
          .map(({ colony }) =>
            colony ? (
              <ColonyGridItem colony={colony} key={colony.colonyAddress} />
            ) : null,
          )}
      </div>
    </div>
  );

ColonyGrid.displayName = displayName;

export default ColonyGrid;
