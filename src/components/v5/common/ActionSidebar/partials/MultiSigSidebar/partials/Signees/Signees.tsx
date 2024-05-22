import { type FC } from 'react';

import { type MultiSigUserSignature } from '~gql';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.Signees';

interface SigneesProps {
  signees: MultiSigUserSignature[];
}

const Signees: FC<SigneesProps> = () => {};

Signees.displayName = displayName;
export default Signees;
