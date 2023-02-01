import React from 'react';

import Numeral from '~shared/Numeral';

interface ReputationChangeDetailProps {
  reputationChange: string;
}

const displayName = 'DetailsWidget.ReputationChangeDetail';

const ReputationChangeDetail = ({
  reputationChange,
}: ReputationChangeDetailProps) => (
  <>
    <Numeral value={reputationChange} />
    {reputationChange === '1' ? ' pt' : ' pts'}
  </>
);

ReputationChangeDetail.displayName = displayName;

export default ReputationChangeDetail;
