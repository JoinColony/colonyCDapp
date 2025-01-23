import { isAddress } from 'ethers/lib/utils';

import { splitAddress, type AddressElements } from '~utils/strings.ts';

interface GetMaskedAddressParams {
  address: string;
  isFull?: boolean;
  mask?: string;
}
interface GetMaskedAddressResult {
  result: string;
  cutAddress: AddressElements | null;
}
const getMaskedAddress = ({
  address,
  isFull = false,
  mask = '...',
}: GetMaskedAddressParams): GetMaskedAddressResult => {
  const isValidAddress = isAddress(address);
  if (!isValidAddress) return { result: address, cutAddress: null };

  const cutAddress: AddressElements = splitAddress(address);

  const result = `${cutAddress.header}${cutAddress.start}${isFull ? cutAddress.middle : mask}${cutAddress.end}`;

  return { result, cutAddress };
};

export default getMaskedAddress;
