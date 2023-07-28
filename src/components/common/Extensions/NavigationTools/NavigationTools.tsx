import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import Button from '~v5/shared/Button';
import { NavigationToolsProps } from './types';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import { useMobile } from '~hooks';
import UserReputation from '../UserNavigation/partials/UserReputation';
import { groupedTransactionsAndMessages } from '~redux/selectors';
import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';

const displayName = 'common.Extensions.NavigationTools';

const NavigationTools: FC<NavigationToolsProps> = ({
  nativeToken,
  buttonLabel,
  hideColonies,
  hideMemberReputationOnMobile = false,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const buttonLabelText =
    typeof buttonLabel === 'string'
      ? buttonLabel
      : buttonLabel && formatMessage(buttonLabel);

  const transactionAndMessageGroups = useSelector(
    groupedTransactionsAndMessages,
  );

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center gap-1">
        {nativeToken && <Token nativeToken={nativeToken} />}
        {!hideColonies && (
          <UserReputation
            hideColonies={hideColonies}
            transactionAndMessageGroups={
              transactionAndMessageGroups as unknown as TransactionOrMessageGroups
            }
            hideMemberReputationOnMobile={hideMemberReputationOnMobile}
          />
        )}
        <Button
          mode="tertiary"
          isFullRounded
          iconName="list"
          iconSize="extraTiny"
        >
          {buttonLabelText ? (
            <span className="text-gray-700 text-3">{buttonLabelText}</span>
          ) : (
            !isMobile && (
              <span className="text-gray-700 text-3">
                {formatMessage({ id: 'helpAndAccount' })}
              </span>
            )
          )}
        </Button>
      </div>
    </div>
  );
};

NavigationTools.displayName = displayName;

export default NavigationTools;
