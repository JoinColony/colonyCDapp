import { Binoculars } from '@phosphor-icons/react';
import { capitalize } from 'lodash';
import React from 'react';

import PermissionsPageInnerContent from './partials/PermissionsPageRows.tsx';

const MultisigPermissionsPage = () => {
  return <PermissionsPageInnerContent isMultiSig />;
};

export default MultisigPermissionsPage;
