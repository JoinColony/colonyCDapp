import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';

import { useGetItems } from './hooks.tsx';
import { type MeatballMenuProps } from './types.ts';

const MeatballMenu: FC<MeatballMenuProps> = ({
  transactionHash,
  defaultValues = {},
  showRedoItem = true,
}) => {
  const isMobile = useMobile();
  const items = useGetItems({ transactionHash, defaultValues, showRedoItem });

  return (
    <MeatBallMenu
      contentWrapperClassName={clsx('sm:min-w-[12.75rem]', {
        '!left-6 right-6': isMobile,
      })}
      dropdownPlacementProps={{
        withAutoTopPlacement: true,
        top: 12,
      }}
      items={items}
    />
  );
};

export default MeatballMenu;
