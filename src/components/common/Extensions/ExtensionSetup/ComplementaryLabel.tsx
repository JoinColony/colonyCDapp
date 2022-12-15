import React from 'react';

import { FormattedMessage } from 'react-intl';
import styles from './ExtensionSetup.css';

const ComplementaryLabel = (labelText) =>
  labelText && (
    <span className={styles.complementaryLabel}>
      <FormattedMessage {...labelText} />
    </span>
  );

export default ComplementaryLabel;
