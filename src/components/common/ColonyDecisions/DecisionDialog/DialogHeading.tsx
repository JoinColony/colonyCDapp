import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import { Heading3 } from '~shared/Heading';

const displayName = 'common.ColonyDecisions.DecisionDialog.DialogHeading';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Decision Details',
  },
  domainDisplay: {
    id: `${displayName}.domainDisplay`,
    defaultMessage: 'Proposal will be created in ',
  },
});

// const handleMotionDomainChange = useCallback(
//   (motionDomainId) => setFieldValue('motionDomainId', motionDomainId),
//   [setFieldValue],
// );

const DialogHeading = () => (
  <DialogSection>
    {/* <MotionDomainSelect
          colony={colony}
          onDomainChange={handleMotionDomainChange}
          dropdownLabel={MSG.domainDisplay}
          disabled={isSubmitting}
          initialSelectedDomain={preselectedDomainId}
        /> */}
    <Heading3 appearance={{ margin: 'none', theme: 'dark' }} text={MSG.title} />
  </DialogSection>
);

DialogHeading.displayName = displayName;

export default DialogHeading;
