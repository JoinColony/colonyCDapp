import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import ExternalLink from '~shared/Extensions/ExternalLink';
import { FEEDBACK, HELP } from '~constants/externalUrls';

import styles from './HelperSection.css';

const displayName = 'PopoverSection.HelperSection';

const MSG = defineMessages({
  reportBugs: {
    id: `${displayName}.reportBugs`,
    defaultMessage: 'Report Bugs',
  },
  helpCenter: {
    id: `${displayName}.helpCenter`,
    defaultMessage: 'Help Center',
  },
});

const HelperSection = () => (
  <DropdownMenuSection separator>
    <DropdownMenuItem>
      <ExternalLink href={FEEDBACK} text={MSG.reportBugs} className={styles.externalLink} />
    </DropdownMenuItem>
    <DropdownMenuItem>
      <ExternalLink href={HELP} text={MSG.helpCenter} className={styles.externalLink} />
    </DropdownMenuItem>
  </DropdownMenuSection>
);

HelperSection.displayName = displayName;

export default HelperSection;
