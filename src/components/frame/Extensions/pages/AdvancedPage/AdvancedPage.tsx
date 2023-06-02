import React, { FC } from 'react';

import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => <Spinner loadingText="advancedPage">Advanced page</Spinner>;

AdvancedPage.displayName = displayName;

export default AdvancedPage;
