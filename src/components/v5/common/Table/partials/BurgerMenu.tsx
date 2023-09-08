import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import { BurgerMenuProps } from '../types';
import Card from '~v5/shared/Card';
import { useDetectClickOutside } from '~hooks';

const displayName = 'v5.common.Table.partials.BurgerMenu';

const BurgerMenu: FC<BurgerMenuProps> = ({
  onToogle,
  onToogleOff,
  isMenuVisible,
  canRemoveRow = true,
  canDuplicateRow = true,
  onRemoveRow,
  onDuplicateRow,
}) => {
  const { formatMessage } = useIntl();
  const ref = useDetectClickOutside({
    onTriggered: () => onToogleOff(),
  });

  return (
    <>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          type="button"
          className="text-gray-400 hover:text-blue-400 p-[0.1875rem] transition-all duration-normal cursor-pointer"
          aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
          onClick={onToogle}
        >
          <Icon name="dots-three" appearance={{ size: 'extraTiny' }} />
        </button>
      </div>
      {isMenuVisible && (
        <Card
          className="p-6 w-full sm:max-w-[11.125rem] absolute top-[calc(100%-1rem)] right-3 z-50"
          hasShadow
          rounded="s"
          ref={ref}
        >
          <ul>
            {canRemoveRow && (
              <li className="mb-4 last:mb-0">
                <button
                  type="button"
                  className="flex text-md text-gray-600 transition-colors hover:text-blue-400"
                  onClick={() => {
                    onRemoveRow();
                    onToogleOff();
                  }}
                >
                  <span className="text-gray-900 flex items-center gap-2">
                    <Icon name="trash" appearance={{ size: 'tiny' }} />
                    {formatMessage({ id: 'button.remove.row' })}
                  </span>
                </button>
              </li>
            )}
            {canDuplicateRow && (
              <li className="mb-4 last:mb-0">
                <button
                  type="button"
                  className="flex text-md text-gray-600 transition-colors hover:text-blue-400"
                  onClick={() => {
                    onDuplicateRow();
                    onToogleOff();
                  }}
                >
                  <span className="text-gray-900 flex items-center gap-2">
                    <Icon name="copy-simple" appearance={{ size: 'tiny' }} />
                    {formatMessage({ id: 'button.duplicate.row' })}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </Card>
      )}
    </>
  );
};

BurgerMenu.displayName = displayName;

export default BurgerMenu;
