import React from 'react';

import ManageReputationContainer from '../ManageReputationContainer';
import { AwardAndSmiteDialogProps } from '../types';

const displayName = 'common.SmiteDialog';

const SmiteDialog = (props: AwardAndSmiteDialogProps) => (
  <ManageReputationContainer {...props} isSmiteAction />
);

SmiteDialog.displayName = displayName;

export default SmiteDialog;
