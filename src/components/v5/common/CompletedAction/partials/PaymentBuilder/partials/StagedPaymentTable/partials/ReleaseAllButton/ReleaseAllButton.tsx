import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

const displayName =
  'v5.common.CompletedAction.partials.StagedPaymentTable.partials.ReleaseAllButton';

const MSG = defineMessages({
  releaseAll: {
    id: `${displayName}.releaseAll`,
    defaultMessage: 'Release all',
  },
});

const ReleaseAllButton = () => {
  return (
    <button
      type="button"
      className="w-full text-center text-gray-900 underline transition-colors text-3 hover:text-blue-400"
    >
      {formatText(MSG.releaseAll)}
    </button>
  );
};

export default ReleaseAllButton;
