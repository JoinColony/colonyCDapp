import fetch from 'cross-fetch';
import { HandlerContext } from '../types';

interface GetGatewayFeeHandlerResponse {
  transactionFeePercentage: number;
  success: boolean;
}

export const getGatewayFeeHandler = async (
  _,
  { apiKey, apiUrl }: HandlerContext,
): Promise<GetGatewayFeeHandlerResponse | undefined> => {
  const res = await fetch(`${apiUrl}/v0/developer/fees`, {
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
  });

  const data = await res.json();

  if (!data.default_liquidation_address_fee_percent) {
    throw new Error('No default_liquidation_address_fee_percent returned');
  } else {
    return {
      transactionFeePercentage: parseFloat(
        data.default_liquidation_address_fee_percent,
      ),
      success: true,
    };
  }
};

export default getGatewayFeeHandler;
