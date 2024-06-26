export type KYCStatus = 'not_started';

export type KYCInfo = {
  bankName: string;
  accountNumber: string;
  bic: string;
  payoutCurrency: string;
  kycStatus: KYCStatus;
  currency: string;
  bicLast4: string;
};
