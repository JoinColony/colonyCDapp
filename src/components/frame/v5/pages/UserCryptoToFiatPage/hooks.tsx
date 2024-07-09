import AutomaticDeposits from './partials/AutomaticDeposits/index.ts';
import BankDetails from './partials/BankDetails/index.ts';
import Verification from './partials/Verification/index.ts';

export const useUserCryptoToFiatPage = () => {
  const rowItems = [
    {
      key: 'verification',
      Component: Verification,
    },
    {
      key: 'bank-details',
      Component: BankDetails,
    },
    {
      key: 'automatic-deposits',
      Component: AutomaticDeposits,
    },
  ];

  return {
    rowItems,
  };
};
