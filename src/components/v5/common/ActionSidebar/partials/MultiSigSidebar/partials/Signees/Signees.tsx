import { Check, X } from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';

import { MultiSigVote } from '~gql';
import { formatText } from '~utils/intl.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type MultiSigSignee } from '../MultiSigWidget/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.Signees';

interface SigneesProps {
  signees: MultiSigSignee[];
}

const renderVotes = (vote: MultiSigVote) => {
  switch (vote) {
    case MultiSigVote.Approve:
      return (
        <div className="flex items-center gap-1">
          <Check size={14} />
          <span>Approved</span>
        </div>
      );
    case MultiSigVote.Reject:
      return (
        <div className="flex items-center gap-1">
          <X size={14} />
          <span>Opposed</span>
        </div>
      );
    default:
      return <div className="text-gray-300">Awaiting</div>;
  }
};

const Signees: FC<SigneesProps> = ({ signees }) => {
  const [loadedSignees, setLoadedSignees] = useState(5);

  const loadMore = () => {
    setLoadedSignees((prev) => prev + 5);
  };

  return (
    <div>
      <ul className="flex flex-col">
        {signees.slice(0, loadedSignees).map((signature) => (
          <li
            className="mb-3 flex w-full flex-row justify-between last:mb-0"
            key={signature.userAddress}
          >
            <UserPopover
              size={20}
              walletAddress={signature.userAddress || ''}
              popperOptions={{ placement: 'bottom-end' }}
              withVerifiedBadge={false}
            />
            <div className="text-sm">{renderVotes(signature.vote)}</div>
          </li>
        ))}
      </ul>
      {loadedSignees < signees.length && (
        <button
          onClick={loadMore}
          type="button"
          className="md:hover:text-blue-500 mt-4 w-full text-center text-sm text-gray-500 transition-colors"
        >
          {formatText({ id: 'button.loadMore' })}
        </button>
      )}
    </div>
  );
};

Signees.displayName = displayName;
export default Signees;
