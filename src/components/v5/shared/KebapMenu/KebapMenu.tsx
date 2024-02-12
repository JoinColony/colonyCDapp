import { DotsThree, DotsThreeVertical } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type KebapMenuProps } from './types.ts';

const displayName = 'v5.KebapMenu';

const KebapMenu: FC<KebapMenuProps> = ({
  className,
  isVertical,
  setTriggerRef,
}) => {
  const { formatMessage } = useIntl();

  return (
    <button
      type="button"
      className={clsx(
        className,
        'text-gray-400 md:hover:text-blue-400 p-[0.1875rem] transition-all duration-normal cursor-pointer flex justify-center items-center',
      )}
      aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
      ref={setTriggerRef}
    >
      {isVertical ? <DotsThreeVertical size={16} /> : <DotsThree size={16} />}
    </button>
  );
};

KebapMenu.displayName = displayName;

export default KebapMenu;
