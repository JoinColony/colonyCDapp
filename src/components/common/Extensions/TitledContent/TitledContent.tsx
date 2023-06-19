import React, { FC, PropsWithChildren } from 'react';

import { TitledContentProps } from './types';
import { useMobile } from '~hooks';
import TitleLabel from '~shared/Extensions/TitleLabel/TitleLabel';

const displayName = 'common.Extensions.TitledContent';

const TitledContent: FC<PropsWithChildren<TitledContentProps>> = ({
  children,
  title,
  className,
  isTitleHiddenOnDesktop,
}) => {
  const isMobile = useMobile();

  return (
    <div className={className}>
      {isTitleHiddenOnDesktop && isMobile && (
        <TitleLabel className="mb-2" text={title} />
      )}
      {children}
    </div>
  );
};

TitledContent.displayName = displayName;

export default TitledContent;
