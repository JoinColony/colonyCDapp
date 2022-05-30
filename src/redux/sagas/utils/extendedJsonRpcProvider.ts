import { JsonRpcProvider, BlockTag } from '@ethersproject/providers';
import { poll } from 'ethers/lib/utils';

export class ExtendedJsonRpcProvider extends JsonRpcProvider {
  _parentGetCode: (
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ) => Promise<string>;

  constructor(...args) {
    super(...args);
    this._parentGetCode = super.getCode;
  }

  getCode(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ): Promise<string> {
    return poll(
      async () => {
        const result = await this._parentGetCode(addressOrName, blockTag);
        if (result === '0x') {
          return '';
        }
        return result;
      },
      {
        timeout: 10000,
      },
    );
  }
}
