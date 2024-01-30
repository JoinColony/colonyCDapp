import { type Token } from '~types/graphql.ts';

export enum TokenChoice {
  Create = 'create',
  Select = 'select',
}

export type FormValues = {
  tokenName?: string;
  tokenSymbol?: string;
  tokenAddress: string;
  token?: Token | null;
  colonyName: string;
  tokenChoice: TokenChoice;
  displayName: string;
  tokenAvatar?: string;
  tokenThumbnail?: string;
};

export type Step1 = Pick<FormValues, 'colonyName' | 'displayName'>;
export type Step2 = Pick<FormValues, 'tokenChoice'>;
export type Step3 = Pick<
  FormValues,
  | 'tokenAddress'
  | 'tokenName'
  | 'tokenSymbol'
  | 'token'
  | 'tokenChoice'
  | 'tokenAvatar'
  | 'tokenThumbnail'
>;
