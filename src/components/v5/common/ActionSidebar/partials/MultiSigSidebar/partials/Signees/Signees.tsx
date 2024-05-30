import React from 'react';
import { type FC } from 'react';

import { type MultiSigUserSignatureFragment } from '~gql';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.Signees';

interface SigneesProps {
  signees: MultiSigUserSignatureFragment[];
}

const Signees: FC<SigneesProps> = ({ signees }) => (
  <div className="flex flex-col">
    {signees.map((signature) => (
      <div className="flex w-full flex-row justify-between">
        <span>{signature.userAddress.slice(0, 10)}...</span>
        <span>{signature.vote}</span>
      </div>
    ))}
  </div>
);

Signees.displayName = displayName;
export default Signees;
