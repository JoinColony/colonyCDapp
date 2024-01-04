import React from 'react';

import ManageReputationContainer from '../ManageReputationContainer';
import { AwardAndSmiteDialogProps } from '../types';

const displayName = 'common.AwardDialog';

const AwardDialog = (props: AwardAndSmiteDialogProps) => (
  <ManageReputationContainer {...props} />
);

AwardDialog.displayName = displayName;

export default AwardDialog;
