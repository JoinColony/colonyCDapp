import { BigNumber } from 'ethers';

import { ContextModule, getContext, setContext } from '~context/index.ts';
import { type TxConfig } from '~types/transactions.ts';

export type Channel = Omit<TxConfig, 'methodName'>;

export const removeOldExtensionClients = (
  colonyAddress: string,
  extensionId: string,
) => {
  try {
    const colonyManager = getContext(ContextModule.ColonyManager);
    // Remove old extensions client if exist
    colonyManager.extensionClients.delete(`${colonyAddress}-${extensionId}`);
    setContext(ContextModule.ColonyManager, colonyManager);
  } catch (error) {
    /*
     * Colony manager was not set yet, so there isn't any extension client to remove
     */
  }
};

export const modifyParams = (params, payload) =>
  params.map(({ paramName }) => {
    if (typeof payload[paramName] === 'number') {
      return BigNumber.from(String(payload[paramName]));
    }
    return payload[paramName];
  });
