import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Logo from '~images/logo.svg';
import NakedMole from '~images/naked-mole-404.svg';
import Heading from '~shared/Heading';

import styles from './FourOFour.css';

const displayName = 'frame.FourOFour';

const MSG = defineMessages({
  message: {
    id: `${displayName}.message`,
    defaultMessage:
      'Something went wrong! Have you tried turning it off and on again?',
  },
  nakedMole: {
    id: `${displayName}.nakedMole`,
    defaultMessage: 'Naked Mole',
  },
  fourOFour: {
    id: `${displayName}.fourOFour`,
    defaultMessage: '404!',
  },
});

const FourOFour = () => (
  <main className={styles.layoutMain}>
    <header className={styles.header}>
      <figure className={styles.logo} role="presentation">
        <Link to="/">
          <Logo />
        </Link>
      </figure>
    </header>
    <div className={styles.herowrapper}>
      <div className={styles.title}>
        <Heading
          appearance={{ size: 'medium', weight: 'medium', margin: 'none' }}
          text={MSG.fourOFour}
        />
      </div>
      <p className={styles.description}>
        <FormattedMessage {...MSG.message} />
      </p>
      <div className={styles.hero}>
        <NakedMole />
      </div>
    </div>
  </main>
);

FourOFour.displayName = displayName;

export default FourOFour;
