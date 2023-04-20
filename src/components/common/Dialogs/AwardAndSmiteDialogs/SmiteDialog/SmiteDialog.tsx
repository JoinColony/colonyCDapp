import React from 'react';

import { AwardAndSmiteDialogProps } from '../types';
import ManageReputationContainer from '../ManageReputationContainer';

const displayName = 'common.SmiteDialog';

const SmiteDialog = (props: AwardAndSmiteDialogProps) => <ManageReputationContainer {...props} isSmiteAction />;

SmiteDialog.displayName = displayName;

export default SmiteDialog;
