import { AppSyncResolverEvent } from 'aws-lambda';
import fetch from 'cross-fetch';
import { HandlerContext } from 'src/types';
import { v4 as uuid } from 'uuid';

interface InputArguments {
  input?: {
    path?: string;
  };
}

interface GetFeesHandlerResponse {
  transactionFee: number;
  success: boolean;
}

export const getFeesHandler = async (
  event: AppSyncResolverEvent<InputArguments>,
  { apiKey, apiUrl }: HandlerContext,
): Promise<GetFeesHandlerResponse | undefined> => {
  const { path } = event.arguments?.input || {};

  if (!path) {
    throw new Error('Path is required');
  }

  const res = await fetch(`${apiUrl}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': uuid(),
      'Api-Key': apiKey,
    },
  });

  const data = await res.json();

  if (!data.default_liquidation_address_fee_percent) {
    throw new Error('No default_liquidation_address_fee_percent returned');
  } else {
    return {
      transactionFee: data.default_liquidation_address_fee_percent,
      success: true,
    };
  }
};
