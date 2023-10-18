import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import {
  adjustConvertedValue,
  convertToDecimalOrNull,
  getFormattedNumeralValue,
} from '~shared/Numeral';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { getTransferFundsDialogPayload } from '~common/Dialogs/TransferFundsDialog/helpers';
import { ColonyFragment } from '~gql';
import { toFinite } from '~utils/lodash';
import { getHasEnoughBalanceTestFn } from '~utils/yup/tests';

export const useBalancePage = () => {
  const { colony } = useColonyContext();
  const { balances } = colony || {};
  const [isSortedDesc, setIsSortedDesc] = useState(true);
  const domainId = 1;

  const prepareTokensData = useMemo(
    () =>
      colony?.tokens?.items.map((item) => {
        const currentTokenBalance =
          getBalanceForTokenAndDomain(
            balances,
            item?.token?.tokenAddress || '',
            domainId,
          ) || 0;
        const decimals = getTokenDecimalsWithFallback(item?.token.decimals);
        let convertedValue = convertToDecimalOrNull(currentTokenBalance);
        if (convertedValue && decimals) {
          convertedValue = adjustConvertedValue(convertedValue, decimals);
        }
        const formattedValue = getFormattedNumeralValue(
          convertedValue,
          currentTokenBalance,
        );

        return {
          ...item,
          balance: formattedValue,
        };
      }),
    [colony?.tokens?.items, balances],
  );

  const onBalanceSort = () => {
    setIsSortedDesc(!isSortedDesc);

    prepareTokensData?.sort((a, b) => {
      if (isSortedDesc) {
        return a.balance > b.balance ? -1 : 1;
      }
      return b.balance > a.balance ? -1 : 1;
    });
  };

  return {
    colony: prepareTokensData,
    isSortedDesc,
    onBalanceSort,
  };
};

export const useTransferFunds = () => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};

  const navigate = useNavigate();
  const enabledExtensionData = useEnabledExtensions();
  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType = isVotingReputationEnabled
    ? ActionTypes.MOTION_MOVE_FUNDS
    : ActionTypes.ACTION_MOVE_FUNDS;

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(nativeToken?.decimals),
    [nativeToken],
  );

  const transform = pipe(
    mapPayload((payload) =>
      getTransferFundsDialogPayload(colony as ColonyFragment, payload),
    ),
    withMeta({ navigate }),
  );

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.boolean().defined(),
      amount: yup
        .number()
        .required()
        .transform((value) => toFinite(value))
        .moreThan(0)
        .test(
          'has-enough-balance',
          () => 'Insufficient balance in from team pot',
          getHasEnoughBalanceTestFn(colony as ColonyFragment),
        ),
      tokenAddress: yup.string().address().required(),
    })
    .defined();

  return {
    actionType,
    transform,
    colony,
    tokenDecimals,
    validationSchema,
  };
};
