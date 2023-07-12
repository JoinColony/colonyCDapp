import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const VerifiedPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.verifiedPage' }}>
    <TwoColumns aside={<Navigation pageName="members" />}>
      Verified page
    </TwoColumns>
  </Spinner>
);

export default VerifiedPage;
