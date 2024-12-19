import React from 'react';

import { currencyIcons } from '~common/Extensions/UserNavigation/partials/UserMenu/consts.ts';
import CoinGeckoAttribution from '~common/Extensions/UserNavigation/partials/UserSubmenu/CoinGeckoAttribution.tsx';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { SupportedCurrencies } from '~gql';
import ClnyTokenIcon from '~icons/ClnyTokenIcon.tsx';

import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';
import { actionItemClass, actionItemLabelClass } from '../submenu.styles.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Currency';

interface CurrencyProps {
  closeSubmenu: VoidFunction;
}

const Currency = ({ closeSubmenu }: CurrencyProps) => {
  const { updatePreferredCurrency } = useCurrencyContext();
  const iconSize = 18;

  const handleCurrencyClick = (currency: SupportedCurrencies) => {
    updatePreferredCurrency(currency);
    closeSubmenu();
  };

  return (
    <>
      <MenuList className="grid w-[calc(100%+2rem)] grid-cols-2">
        {Object.values(SupportedCurrencies)
          /**
           * @Note This filter needs to be removed once we re-enable SupportedCurrencies.Clny
           */
          .filter(
            (supportedCurrency) =>
              supportedCurrency !== SupportedCurrencies.Clny,
          )
          .reverse()
          .map((currency) => {
            const CurrencyIcon = currencyIcons[currency] || ClnyTokenIcon;
            return (
              <MenuListItem key={currency} className="w-full">
                <button
                  type="button"
                  onClick={() => {
                    handleCurrencyClick(currency);
                  }}
                  className={actionItemClass}
                >
                  <CurrencyIcon size={iconSize} />
                  <p className={actionItemLabelClass}>
                    {currency.toUpperCase()}
                  </p>
                </button>
              </MenuListItem>
            );
          })}
      </MenuList>

      {/* Can be removed if/when upgrading to paid plan */}
      <CoinGeckoAttribution />
    </>
  );
};

Currency.displayName = displayName;
export default Currency;
